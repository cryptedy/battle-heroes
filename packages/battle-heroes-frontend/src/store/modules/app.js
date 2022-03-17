import { SET_APP_LOADING, SET_APP_LOADED } from '../mutation-types'

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
  [SET_APP_LOADING](state, { loading }) {
    state.loading = loading
  },

  [SET_APP_LOADED](state, { loaded }) {
    state.loaded = loaded
  }
}

export const actions = {
  async setLoading({ commit }, loading) {
    console.log('app/setLoading', loading)

    commit(SET_APP_LOADING, { loading })
  },

  async setLoaded({ commit }, loaded) {
    console.log('app/setLoaded', loaded)

    commit(SET_APP_LOADED, { loaded })
  }
}
