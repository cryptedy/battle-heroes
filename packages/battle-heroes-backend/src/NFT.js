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
      name: name,
      image_url: `${IMAGE_URL}/${collectionId}/${tokenId}.png`,
      attributes: attributes
    })
  })

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

const getMetadata = async collectionId => {
  return axios.get(`${METADATA_URL}/${collectionId}/index.json`)
}

const getContractAddress = collectionId => {
  return COLLECTIONS[collectionId].contract_address
}

module.exports = {
  getNFTs,
  getNFTsForAddress
}
