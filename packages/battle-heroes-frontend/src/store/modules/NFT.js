import * as types from '../mutation-types'
import NFTService from '@/services/NFTService'
import { COLLECTION, COLLECTIONS } from '@/utils/constants'

const initialState = () => ({
  NFTs: {
    [COLLECTION.PIXEL_HEROES]: {},
    [COLLECTION.PIXEL_HEROES_X]: {}
  },

  tokenIds: {
    [COLLECTION.PIXEL_HEROES]: [],
    [COLLECTION.PIXEL_HEROES_X]: []
  }
})

export const state = initialState()

export const getters = {
  all: state => collectionId =>
    state.tokenIds[collectionId].map(
      tokenId => state.NFTs[collectionId][tokenId]
    ),
  userNFTs: (state, getters, rootState) => collectionId =>
    rootState.auth.tokenIds[collectionId].map(
      tokenId => state.NFTs[collectionId][tokenId]
    )
}

export const mutations = {
  [types.SET_NFTS](state, { collectionId, NFTs }) {
    state.NFTs[collectionId] = NFTs
    state.tokenIds[collectionId] = Object.keys(NFTs)
      .map(tokenId => Number.parseInt(tokenId))
      .sort((a, b) => a - b)
  },

  [types.DELETE_NFTS](state, { collectionId }) {
    const { NFTs, tokenIds } = initialState()

    state.NFTs[collectionId] = NFTs[collectionId]
    state.tokenIds[collectionId] = tokenIds[collectionId]
  }
}

export const actions = {
  async getNFTs({ commit }) {
    for (const collectionId of Object.keys(COLLECTIONS)) {
      try {
        const NFTs = await NFTService.getNFTs(collectionId)
        commit(types.SET_NFTS, { collectionId, NFTs })
      } catch (error) {
        commit(types.DELETE_NFTS, { collectionId })
      }
    }
  }
}
