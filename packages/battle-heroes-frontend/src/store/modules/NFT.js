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
  },

  userTokenIds: {
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
  userNFTs: state => collectionId =>
    state.userTokenIds[collectionId].map(
      tokenId => state.NFTs[collectionId][tokenId]
    )
}

export const mutations = {
  [types.RESET_NFT_STATE](state) {
    Object.assign(state, initialState())
  },

  [types.SET_NFTS](state, { collectionId, NFTs }) {
    const NFTsObject = {}
    const tokenIds = []

    NFTs.forEach(NFT => {
      NFTsObject[NFT.token_id] = NFT
      tokenIds.push(NFT.token_id)
    })

    state.NFTs[collectionId] = NFTsObject
    state.tokenIds[collectionId] = tokenIds.sort((a, b) => a - b)
  },

  [types.DELETE_NFTS](state, { collectionId }) {
    const { NFTs, tokenIds } = initialState()

    state.NFTs[collectionId] = NFTs[collectionId]
    state.tokenIds[collectionId] = tokenIds[collectionId]
  },

  [types.SET_USER_NFTs](state, { collectionId, NFTs }) {
    state.userTokenIds[collectionId] = NFTs.map(NFT => NFT.token_id).sort(
      (a, b) => a - b
    )
  },

  [types.DELETE_USER_NFTs](state, { collectionId }) {
    const { tokenIds } = initialState()
    state.userTokenIds[collectionId] = tokenIds[collectionId]
  }
}

export const actions = {
  reset({ commit }) {
    commit(types.RESET_NFT_STATE)
  },

  async getNFTs({ commit }) {
    for (const collectionId of Object.keys(COLLECTIONS)) {
      try {
        const NFTs = await NFTService.getNFTs(collectionId)
        commit(types.SET_NFTS, { collectionId, NFTs })
      } catch (error) {
        commit(types.DELETE_NFTS, { collectionId })

        throw new Error(error)
      }
    }
  },

  async getNFTsForAddress({ commit }, { address }) {
    for (const collectionId of Object.keys(COLLECTIONS)) {
      try {
        const NFTs = await NFTService.getNFTsForAddress(collectionId, address)

        commit(types.SET_USER_NFTs, { collectionId, NFTs })
      } catch (error) {
        commit(types.DELETE_USER_NFTs, { collectionId })

        throw new Error(error)
      }
    }
  }
}
