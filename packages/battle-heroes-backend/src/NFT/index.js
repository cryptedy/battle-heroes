const axios = require('axios')
const Moralis = require('moralis/node')
const { selectNFTs } = require('./selectors')
const { selectCollections } = require('../collection/selectors')
const { METADATA_URL, IMAGE_URL } = require('../utils/constants')

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

const rarityFormat = rarity => (rarity * 100).toFixed(1)

const scoreFormat = score => Number.parseFloat(score.toFixed(2))

const pointFormat = normalizedRank =>
  Number.parseFloat(normalizedRank.toFixed(2))

const getMetadata = async collection => {
  return axios.get(`${METADATA_URL}/${collection.id}/index.json`)
}



const getMoralisTokenExp = async (collectionId, tokenId) => {
  console.log('getMoralisTokenExp', collectionId, tokenId )
  const collectionIds = [collectionId]
  const tokenIds = [tokenId]

  const TokenExp = Moralis.Object.extend("TokenExp")
  const query = new Moralis.Query(TokenExp)
  query.equalTo("tokenId", 1)
  const results = await query.find()
  console.log(results[0].get("exp"))
  if (!results[0].get("exp")){
    results[0].set("exp", 100)
    results[0].save()
  }
  /*
  const tokenExps = await Moralis.Cloud.run('getTokenExps', { collectionIds : collectionIds, tokenIds : tokenIds })
  console.log(tokenExps)*/
  return results
}


module.exports = {
  getNFTs,
  getNFTIdsForAddress,
  getMoralisTokenExp
}
