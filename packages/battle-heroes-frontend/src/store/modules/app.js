import * as types from '../mutation-types'

const initialState = () => {
  return {
    loading: false,
    loaded: false
  }
}

export const state = initialState()

export const getters = {
  loading: state => state.loading,
  loaded: state => state.loaded
}

export const mutations = {
  [types.RESET_APP_STATE](state) {
    Object.assign(state, initialState())
  },

  [types.SET_LOADING](state, { loading }) {
    state.loading = loading
  },

  [types.SET_LOADED](state, { loaded }) {
    state.loaded = loaded
  }
}

export const actions = {
  reset({ commit }) {
    commit(types.RESET_APP_STATE)
  },

  async setLoading({ commit }, { loading }) {
    commit(types.SET_LOADING, { loading })
  },

  async setLoaded({ commit }, { loaded }) {
    commit(types.SET_LOADED, { loaded })
  }
}
