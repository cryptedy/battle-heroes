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

  return NFTs
}

const getNFTIdsForAddress = async address => {
  const NFTIds = []

  const collections = selectCollections()

  const NFTs = selectNFTs()
  const tokenIds = await getTokenIdsForAddress(address)

  for (const collection of collections) {
    console.log(collection)

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
  const currentPage = 1
  const offset = currentPage - 1
  const perPage = 100

  const { total, result: firstNFTs } = await getNFTsForContract(
    collection,
    address,
    offset,
    perPage
  )

  const paginatedNFTs = await getPaginatedNFTsForCollectionAndAddress(
    collection,
    address,
    currentPage,
    total,
    perPage
  )

  const NFTs = firstNFTs.concat(...paginatedNFTs)

  NFTs.forEach(NFT => (NFT.token_id = Number.parseInt(NFT.token_id)))

  return NFTs
}

const getPaginatedNFTsForCollectionAndAddress = async (
  collection,
  address,
  currentPage,
  total,
  perPage
) => {
  const lastPage = Math.ceil(total / perPage)
  const paginatedNFTs = []

  for (let page = currentPage + 1; page <= lastPage; page++) {
    const offset = (page - 1) * perPage

    const { result: NFTs } = await getNFTsForContract(
      collection,
      address,
      offset,
      perPage
    )

    paginatedNFTs.push(NFTs)
  }

  return paginatedNFTs
}

const getNFTsForContract = async (
  collection,
  address,
  offset = 0,
  limit = 100
) => {
  return await new Promise((resolve, reject) => {
    // wait 5 second for avoid rate limit
    setTimeout(() => {
      try {
        const NFTs = Moralis.Web3API.account.getNFTsForContract({
          chain: collection.chain,
          address,
          token_address: collection.contract_address,
          offset,
          limit
        })

        resolve(NFTs)
      } catch (error) {
        reject(error)
      }
    }, 5000)
  })
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

const rarityFormat = rarity => (rarity * 100).toFixed(1)

const scoreFormat = score => score.toFixed(2)

const getMetadata = async collection => {
  return axios.get(`${METADATA_URL}/${collection.id}/index.json`)
}

module.exports = {
  getNFTs,
  getNFTIdsForAddress
}
