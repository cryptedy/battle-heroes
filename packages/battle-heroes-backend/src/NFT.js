const axios = require('axios')
const Moralis = require('moralis/node')
const { COLLECTIONS, METADATA_URL, IMAGE_URL } = require('./constants')

const getNFTs = async collectionId => {
  const NFTs = []

  const { data: metadata } = await getMetadata(collectionId)

  metadata.forEach(data => {
    const { name, edition, attributes } = data
    const tokenId = edition

    NFTs.push({
      token_id: tokenId,
      name,
      image_url: `${IMAGE_URL}/${collectionId}/${tokenId}.png`,
      attributes
    })
  })

  addRarity(NFTs)
  addRank(NFTs)

  return NFTs
}

const getNFTsForAddress = async (collectionId, address) => {
  const currentPage = 1
  const offset = currentPage - 1
  const perPage = 500

  const { total, result: firstNFTs } = await getNFTsForContract(
    collectionId,
    address,
    offset,
    perPage
  )

  const paginatedNFTs = await getPaginatedNFTsForAddress(
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

const getPaginatedNFTsForAddress = async (
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
  return COLLECTIONS.find(collection => collection.id === collectionId)
    .contract_address
}

module.exports = {
  getNFTs,
  getNFTsForAddress
}
