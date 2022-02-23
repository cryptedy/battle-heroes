import * as types from '../mutation-types'
import NFTService from '@/services/NFTService'
import AuthService from '@/services/AuthService'
import { COLLECTION, COLLECTIONS } from '@/utils/constants'

const initialState = () => ({
  user: null,
  tokenIds: {
    [COLLECTION.PIXEL_HEROES]: [],
    [COLLECTION.PIXEL_HEROES_X]: []
  }
})

export const state = initialState()

export const getters = {
  user: state => state.user,
  check: (state, getters) => getters.user !== null
}

export const mutations = {
  [types.SET_USER](state, { user }) {
    state.user = user
  },

  [types.DELETE_USER](state) {
    const { user } = initialState()
    state.user = user
  },

  [types.SET_USER_TOKEN_IDS](state, { collectionId, userNFTTokenIds }) {
    state.tokenIds[collectionId] = userNFTTokenIds.sort((a, b) => a - b)
  },

  [types.DELETE_USER_TOKEN_IDS](state, { collectionId }) {
    const { tokenIds } = initialState()
    state.tokenIds[collectionId] = tokenIds[collectionId]
  }
}

export const actions = {
  async login({ commit }) {
    try {
      const user = await AuthService.login()

      if (user) {
        commit(types.SET_USER, { user })
      }
    } catch (error) {
      console.log(error)
      commit(types.DELETE_USER)
    }
  },

  async getUser({ commit }) {
    try {
      const user = await AuthService.getUser()

      if (user) {
        commit(types.SET_USER, { user })
      }
    } catch (error) {
      console.log(error)
      commit(types.DELETE_USER)
    }
  },

  async getUserNFTTokenIds({ commit, rootGetters }) {
    for (const collectionId of Object.keys(COLLECTIONS)) {
      try {
        const userAddress = rootGetters['auth/user'].address

        const userNFTTokenIds = await NFTService.getUserNFTTokenIds(
          collectionId,
          userAddress
        )

        commit(types.SET_USER_TOKEN_IDS, { collectionId, userNFTTokenIds })
      } catch (error) {
        console.log(error)
        commit(types.DELETE_USER_TOKEN_IDS, { collectionId })
      }
    }
  },

  async logout({ commit }) {
    try {
      await AuthService.logout()
    } catch (error) {
      console.log(error)
    } finally {
      commit(types.DELETE_USER)
    }
  }
}
