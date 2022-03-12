import { SET_LOADING, SET_LOADED } from '../mutation-types'

const initialState = () => {
  return {
    loading: false,
    loaded: false
  }
}

export const state = initialState()

export const getters = {
  isLoading: state => state.loading,
  isLoaded: state => state.loaded
}

export const mutations = {
  [SET_LOADING](state, { loading }) {
    state.loading = loading
  },

  [SET_LOADED](state, { loaded }) {
    state.loaded = loaded
  }
}

export const actions = {
  async setLoading({ commit }, loading) {
    console.log('app/setLoading', loading)

    commit(SET_LOADING, { loading })
  },

  async setLoaded({ commit }, loaded) {
    console.log('app/setLoaded', loaded)

    commit(SET_LOADED, { loaded })
  }
}
