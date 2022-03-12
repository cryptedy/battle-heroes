import axios from 'axios'
import { COLLECTIONS, API_URL } from '@/utils/constants'
import { SET_NFTS, DELETE_NFTS } from '../mutation-types'

const initialState = () => {
  const NFTs = {}
  const tokenIds = {}

  for (const collectionId of Object.keys(COLLECTIONS)) {
    NFTs[collectionId] = {}
    tokenIds[collectionId] = []
  }

  return {
    NFTs,
    tokenIds
  }
}

export const state = initialState()

export const getters = {
  isLoaded: state =>
    Object.keys(COLLECTIONS).filter(
      collectionId => state.tokenIds[collectionId].length > 0
    ).length === Object.keys(COLLECTIONS).length,
  all: state => collectionId =>
    state.tokenIds[collectionId].map(
      tokenId => state.NFTs[collectionId][tokenId]
    ),
  byPlayer: state => (collectionId, player) => {
    return player.token_ids[collectionId].map(
      tokenId => state.NFTs[collectionId][tokenId]
    )
  }
}

export const mutations = {
  [SET_NFTS](state, { collectionId, NFTs }) {
    const NFTsObject = {}
    const tokenIds = []

    NFTs.forEach(NFT => {
      NFTsObject[NFT.token_id] = NFT
      tokenIds.push(NFT.token_id)
    })

    state.NFTs[collectionId] = NFTsObject
    state.tokenIds[collectionId] = tokenIds.sort((a, b) => a - b)
  },

  [DELETE_NFTS](state, { collectionId }) {
    const { NFTs, tokenIds } = initialState()

    state.NFTs[collectionId] = NFTs[collectionId]
    state.tokenIds[collectionId] = tokenIds[collectionId]
  }
}

export const actions = {
  async getNFTs({ commit }) {
    console.log('NFT/getNFTs')

    for (const collectionId of Object.keys(COLLECTIONS)) {
      console.log('NFT/getNFTs', collectionId)

      try {
        const { data: NFTs } = await axios.get(
          `${API_URL}/collections/${collectionId}`
        )

        commit(SET_NFTS, { collectionId, NFTs })
      } catch (error) {
        commit(DELETE_NFTS, { collectionId })

        throw new Error(error)
      }
    }
  }
}
