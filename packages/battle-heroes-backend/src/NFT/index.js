const axios = require('axios')
const Moralis = require('moralis/node')
const { selectNFTs } = require('./selectors')
const { selectCollections } = require('../collection/selectors')
const { METADATA_URL, IMAGE_URL } = require('../utils/constants')

const getNFTs = async () => {
  const NFTs = []

  const collections = selectCollections()

  for (const collection of collections) {
    const NFTsForCollection = await getNFTsForCollection(collection.id)

    NFTsForCollection.forEach(NFTForCollection => {
      NFTForCollection.id = NFTs.length + 1

      NFTs.push(NFTForCollection)
    })
  }

  return NFTs
}

const getNFTsForCollection = async collectionId => {
  const NFTs = []

  const { data: metadata } = await getMetadata(collectionId)

  metadata.forEach(data => {
    const { name, edition, attributes } = data
    const tokenId = edition

    NFTs.push({
      token_id: tokenId,
      collection_id: collectionId,
      name,
      image_url: `${IMAGE_URL}/${collectionId}/${tokenId}.png`,
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
      collection.id,
      address
    )
  }

  return tokenIds
}

const getTokenIdsForCollectionAndAddress = async (collectionId, address) => {
  const NFTs = await getNFTsForCollectionAndAddress(collectionId, address)

  return NFTs.map(NFT => NFT.token_id).sort((a, b) => a - b)
}

const getNFTsForCollectionAndAddress = async (collectionId, address) => {
  const currentPage = 1
  const offset = currentPage - 1
  const perPage = 500

  const { total, result: firstNFTs } = await getNFTsForContract(
    collectionId,
    address,
    offset,
    perPage
  )

  const paginatedNFTs = await getPaginatedNFTsForCollectionAndAddress(
    collectionId,
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
  collectionId,
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
      collectionId,
      address,
      offset,
      perPage
    )

    paginatedNFTs.push(NFTs)
  }

  return paginatedNFTs
}

const getNFTsForContract = async (
  collectionId,
  address,
  offset = 0,
  limit = 500
) => {
  return Moralis.Web3API.account.getNFTsForContract({
    chain: 'matic',
    address: address,
    token_address: getContractAddress(collectionId),
    offset: offset,
    limit: limit
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

const getMetadata = async collectionId => {
  return axios.get(`${METADATA_URL}/${collectionId}/index.json`)
}

const getContractAddress = collectionId => {
  const collections = selectCollections()

  return collections.find(collection => collection.id === collectionId)
    .contract_address
}

module.exports = {
  getNFTs,
  getNFTIdsForAddress
}
