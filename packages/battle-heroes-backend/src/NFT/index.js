const axios = require('axios')
const Moralis = require('moralis/node')
const { selectNFTs } = require('./selectors')
const { selectCollections } = require('../collection/selectors')
const { METADATA_URL, IMAGE_URL } = require('../utils/constants')
const { updateNFT } = require('./actions')

//ethersモジュール読み込み
const { ethers } = require('ethers')
const { BigNumber } = require('ethers')

const getNFTs = async () => {
  const NFTs = []

  const collections = selectCollections()

  for (const collection of collections) {
    const NFTsForCollection = await getNFTsForCollection(collection)

    NFTsForCollection.forEach(NFTForCollection => {
      NFTForCollection.id = NFTs.length + 1

      NFTs.push(NFTForCollection)
    })
  }

  return NFTs
}

const getNFTsForCollection = async collection => {
  const NFTs = []

  const { data: metadata } = await getMetadata(collection)

  metadata.forEach(data => {
    const { name, attributes } = data

    const words = name.split('#')
    const tokenId = Number.parseInt(words[1])

    NFTs.push({
      token_id: tokenId,
      collection_id: collection.id,
      name,
      image_url: `${IMAGE_URL}/${collection.id}/${tokenId}.png`,
      attributes
    })
  })

  await addExps(NFTs)
  addRarity(NFTs)
  addRank(NFTs)
  addPoint(NFTs)
  addStars(NFTs)

  return NFTs
}

const getNFTIdsForAddress = async address => {
  const NFTIds = []

  const collections = selectCollections()

  const NFTs = selectNFTs()
  const tokenIds = await getTokenIdsForAddress(address)

  for (const collection of collections) {
    tokenIds[collection.id].forEach(tokenId => {
      const NFT = NFTs.find(
        NFT => NFT.collection_id === collection.id && NFT.token_id === tokenId
      )

      NFTIds.push(NFT.id)
    })
  }

  return NFTIds
}

const getTokenIdsForAddress = async address => {
  const tokenIds = {}

  const collections = selectCollections()

  for (const collection of collections) {
    tokenIds[collection.id] = []

    tokenIds[collection.id] = await getTokenIdsForCollectionAndAddress(
      collection,
      address
    )
  }

  return tokenIds
}

const getTokenIdsForCollectionAndAddress = async (collection, address) => {
  const NFTs = await getNFTsForCollectionAndAddress(collection, address)

  return NFTs.map(NFT => NFT.token_id).sort((a, b) => a - b)
}

const getNFTsForCollectionAndAddress = async (collection, address) => {
  const NFTs = await getNFTsForContract(collection, address)

  NFTs.forEach(NFT => (NFT.token_id = Number.parseInt(NFT.token_id)))

  return NFTs
}

const getNFTsForContract = async (collection, address) => {
  let cursor = null
  const NFTs = []

  do {
    const response = await Moralis.Web3API.account.getNFTsForContract({
      chain: collection.chain,
      address,
      token_address: collection.contract_address,
      limit: 100,
      cursor: cursor
    })

    console.log(
      `Got page ${response.page} of ${Math.ceil(
        response.total / response.page_size
      )}, ${response.total} total`
    )

    NFTs.push(...response.result)

    cursor = response.cursor
  } while (cursor !== '' && cursor !== null)

  return NFTs
}

const getOwnerOfTokenId = async (collection, tokenId) => {
  const response = await Moralis.Web3API.token.getTokenIdOwners({
    chain: collection.chain,
    address: collection.contract_address,
    token_id: tokenId
  })

  console.log(
    `CollectionId:${collection.id}, TokenId:${tokenId}, Owner:${response.result[0].owner_of}`
  )

  return response.result[0].owner_of
}

const getTraits = NFTs => {
  const traits = {}

  for (const NFT of NFTs) {
    for (const attribute of NFT.attributes) {
      const { trait_type: type, value } = attribute

      if (!Object.prototype.hasOwnProperty.call(traits, type)) {
        traits[type] = {}
      }

      if (!Object.prototype.hasOwnProperty.call(traits[type], value)) {
        traits[type][value] = { quantity: 0 }
      }

      traits[type][value].quantity++
    }
  }

  return traits
}

const getRarity = NFTs => {
  const traits = getTraits(NFTs)

  const rarity = {}

  for (const type of Object.keys(traits)) {
    rarity[type] = {}

    for (const value of Object.keys(traits[type])) {
      if (!Object.prototype.hasOwnProperty.call(rarity[type], value)) {
        const traitQuantity = traits[type][value].quantity
        const collectionQuantity = NFTs.length
        const rarityPercentage = traitQuantity / collectionQuantity

        rarity[type][value] = {
          quantity: traitQuantity,
          rarity: rarityPercentage,
          score: 1 / rarityPercentage
        }
      }
    }
  }

  return rarity
}

const addRarity = NFTs => {
  const rarity = getRarity(NFTs)

  NFTs.forEach(NFT => {
    let NFTScore = 0

    for (const attribute of NFT.attributes) {
      const { trait_type: type, value } = attribute

      const traitScore = rarity[type][value].score

      attribute.quantity = rarity[type][value].quantity
      attribute.rarity = rarityFormat(rarity[type][value].rarity)
      attribute.score = scoreFormat(traitScore)

      NFTScore += traitScore
    }

    NFT.score = scoreFormat(NFTScore)
  })

  return NFTs
}

const addRank = NFTs => {
  const scores = NFTs.map(NFT => NFT.score)
    .sort((a, b) => a - b)
    .reverse()

  NFTs.forEach(
    NFT => (NFT.rank = scores.findIndex(score => score === NFT.score) + 1)
  )

  return NFTs
}

const addPoint = NFTs => {
  const normalize = (value, max, min) => {
    return (value - min) / (max - min)
  }

  const collectionQuantity = NFTs.length

  NFTs.forEach(NFT => {
    const point = (1 - normalize(NFT.rank, collectionQuantity, 1)) * 100
    NFT.point = pointFormat(point)
  })

  return NFTs
}

const addStars = NFTs => {
  const maxStars = 5
  const maxPoint = 100
  const block = maxPoint / maxStars

  NFTs.forEach(NFT => {
    const position = Number.parseInt(Math.round(NFT.point / block))
    NFT.stars = Math.max(1, position)
  })

  return NFTs
}

const addExps = async NFTs => {
  const defaultExp = 0
  const allTokenExps = await getMoralisAllTokenExps()
  for (let i = 0; i < NFTs.length; i++) {
    const findedToken = allTokenExps.find(
      token =>
        token.collectionId === NFTs[i].collection_id &&
        token.tokenId === NFTs[i].token_id
    )
    NFTs[i].exp = findedToken?.exp || defaultExp
    if (findedToken?.exp > 0)
      console.log(NFTs[i].exp, NFTs[i].collection_id, NFTs[i].token_id)
    NFTs[i].start_block_number = findedToken?.startBlockNumber
  }
  return NFTs
}

const rarityFormat = rarity => (rarity * 100).toFixed(1)

const scoreFormat = score => Number.parseFloat(score.toFixed(2))

const pointFormat = normalizedRank =>
  Number.parseFloat(normalizedRank.toFixed(2))

const getMetadata = async collection => {
  return axios.get(`${METADATA_URL}/${collection.id}/index.json`)
}

const getMoralisTokenExp = async (collectionId, tokenId) => {
  //Temporally code
  const NFT = selectNFTs().find(
    e => e.collection_id === collectionId && e.token_id === tokenId
  )
  console.log('Data from redux(exp, sbn)', NFT.exp, NFT.startBlockNumber)
  //Temporally code

  console.log('getMoralisTokenExp', collectionId, tokenId)
  const tokenExps = await Moralis.Cloud.run('getTokenExps', {
    collectionIds: [collectionId],
    tokenIds: [tokenId]
  })
  return tokenExps[0]
}

const getMoralisAllTokenExps = async () => {
  console.log('getMoralisAllTokenExps')
  const results = await Moralis.Cloud.run('getAllTokenExps')
  const tokenExps = []
  for (const result of results) {
    let exp = result?.get('exp')
    if (!exp) exp = 0
    tokenExps.push({
      collectionId: result.get('collectionId'),
      tokenId: result.get('tokenId'),
      exp: exp,
      startBlockNumber: result.get('startBlockNumber')
    })
  }

  return tokenExps
}

/**
 *
 * @param {*} collectionId is the collection id of NFTs
 * @param {*} tokenId is the token id of NFT
 * @param {*} dexp is the added exp amount. Negative value means subtracting.
 * @param {*} unlock is the logical to execute unlocking to change on chain status
 * @returns
 */
const addMoralisTokenExp = async (
  collectionId,
  tokenId,
  dexp,
  unlock = false
) => {
  const maxTrial = 3
  console.log('addMoralisTokenExp')
  const tokenExps = await Moralis.Cloud.run('getTokenExps', {
    collectionIds: [collectionId],
    tokenIds: [tokenId]
  })
  if (tokenExps.length == 0)
    throw 'addMoralisTokenExp : Token as given id cannot be founded'
  console.log(tokenExps[0]?.exp + dexp)
  let param = {
    collectionId: collectionId,
    tokenId: tokenId,
    payload: {
      exp: tokenExps[0].exp + dexp
    }
  }
  // If unlock is directed, add startBlockNumber is undefined on payload
  if (unlock) {
    param.payload['startBlockNumber'] = 0
  }
  console.log('addMoralisTokenExp param for cloud function:', param)
  // Exp should be positive
  if (param.payload.exp < 0) param.payload.exp = 0
  let newTokenExp
  for (let i = 0; i < maxTrial; i++) {
    try {
      newTokenExp = await Moralis.Cloud.run('setTokenExp', param)
      console.log(newTokenExp)
      // exit loop
      i = maxTrial
    } catch (err) {
      console.log('Error in setTokenExp:', err.message)
    }
  }
  if (newTokenExp) {
    // update redux
    let NFT = selectNFTs().find(
      e =>
        e.collection_id === newTokenExp.collectionId &&
        e.token_id === newTokenExp.tokenId
    )
    //NFT.exp = newTokenExp.exp
    if (unlock) {
      updateNFT({
        NFTId: NFT.id,
        payload: {
          exp: newTokenExp.exp,
          startBlockNumber: newTokenExp.startBlockNumber
        }
      })
    } else {
      updateNFT({ NFTId: NFT.id, payload: { exp: newTokenExp.exp } })
    }
  } else {
    throw 'Cannot set new tokenExp on Moralis DB'
  }

  return newTokenExp
}
const updateMoralisStartBlockNumber = async (
  collectionId,
  tokenId,
  newBlockNumber
) => {
  const maxTrial = 3
  console.log('updateMoralisStartBlockNumber')
  const tokenExps = await Moralis.Cloud.run('getTokenExps', {
    collectionIds: [collectionId],
    tokenIds: [tokenId]
  })
  if (tokenExps.length == 0)
    throw 'updateMoralisStartBlockNumber : Token as given id cannot be founded'
  console.log(`Collection Id:${collectionId}, Token Id:${tokenId}`)
  console.log(
    `startBlockNumber Previous:${tokenExps[0]?.startBlockNumber}, New:${newBlockNumber}`
  )
  let param = {
    collectionId: collectionId,
    tokenId: tokenId,
    payload: {
      startBlockNumber: newBlockNumber
    }
  }
  let newTokenExp
  for (let i = 0; i < maxTrial; i++) {
    try {
      newTokenExp = await Moralis.Cloud.run('setTokenExp', param)
      console.log(newTokenExp)
      // exit loop
      i = maxTrial
    } catch (err) {
      console.log('Error in setTokenExp:', err.message)
    }
  }
  if (newTokenExp) {
    // update redux
    let NFT = selectNFTs().find(
      e =>
        e.collection_id === newTokenExp.collectionId &&
        e.token_id === newTokenExp.tokenId
    )
    //NFT.startBlockNumber = newTokenExp.startBlockNumber
    updateNFT({
      NFTId: NFT.id,
      payload: { startBlockNumber: newTokenExp.startBlockNumber }
    })
  } else {
    throw 'Cannot set new tokenExp on Moralis DB'
  }

  return newTokenExp
}

const getMoralisConfig = async _name => {
  console.log('getMoralisConfig', _name)
  return await Moralis.Cloud.run('getConfig', {
    name: _name
  })
}

const setMoralisConfig = async (_name, _data) => {
  console.log('setMoralisConfig', _name, _data)
  return await Moralis.Cloud.run('setConfig', {
    name: _name,
    data: _data
  })
}

const createMoralisConfig = async (_name, _data) => {
  console.log('createtMoralisConfig', _name, _data)
  return await Moralis.Cloud.run('createConfig', {
    name: _name,
    data: _data
  })
}

module.exports = {
  getNFTs,
  getNFTIdsForAddress,
  getMoralisTokenExp,
  addMoralisTokenExp,
  getOwnerOfTokenId,
  updateMoralisStartBlockNumber,
  getMoralisConfig,
  setMoralisConfig,
  createMoralisConfig
}
