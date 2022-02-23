import * as types from '../mutation-types'

const initialState = () => {
  return {
    initialized: false,
    initializeError: false
  }
}

export const state = initialState()

export const getters = {
  initialized: state => state.initialized,
  initializeError: state => state.initializeError
}

export const mutations = {
  [types.APP_INIT_SUCCESS](state) {
    state.initialized = true
    state.initializeError = false
  },

  [types.APP_INIT_FAILURE](state) {
    state.initialized = false
    state.initializeError = true
  }
}

export const actions = {
  async initialize({ commit, dispatch, getters, rootGetters }) {
    if (!getters.initialized) {
      try {
        await dispatch('NFT/getNFTs', null, { root: true })

        if (!rootGetters['auth/check']) {
          await dispatch('auth/fetchUser', null, { root: true })
        }

        if (rootGetters['auth/check']) {
          await dispatch('auth/getUserNFTTokenIds', null, { root: true })
        }
      } catch (error) {
        console.log(error)
        return commit(types.APP_INIT_FAILURE)
      }
    }

    commit(types.APP_INIT_SUCCESS)
  }
}
