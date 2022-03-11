import { RESET_APP_STATE, SET_LOADING, SET_LOADED } from '../mutation-types'

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
  [RESET_APP_STATE](state) {
    Object.assign(state, initialState())
  },

  [SET_LOADING](state, { loading }) {
    state.loading = loading
  },

  [SET_LOADED](state, { loaded }) {
    state.loaded = loaded
  }
}

export const actions = {
  reset({ commit }) {
    commit(RESET_APP_STATE)
  },

  async setLoading({ commit }, { loading }) {
    commit(SET_LOADING, { loading })
  },

  async setLoaded({ commit }, { loaded }) {
    commit(SET_LOADED, { loaded })
  }
}
