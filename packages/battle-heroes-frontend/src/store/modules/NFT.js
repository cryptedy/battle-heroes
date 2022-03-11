import axios from 'axios'
import { COLLECTIONS, API_URL } from '@/utils/constants'
import { RESET_NFT_STATE, SET_NFTS, DELETE_NFTS } from '../mutation-types'

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
  [RESET_NFT_STATE](state) {
    Object.assign(state, initialState())
  },

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
  reset({ commit }) {
    commit(RESET_NFT_STATE)
  },

  async getNFTs({ commit }) {
    for (const collectionId of Object.keys(COLLECTIONS)) {
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
