import {
  SET_APP_LOADING,
  SET_APP_LOADED,
  SET_APP_ERROR
} from '../mutation-types'

const initialState = () => {
  return {
    loading: false,
    loaded: false,
    error: ''
  }
}

export const state = initialState()

export const getters = {
  isLoading: state => state.loading,
  isLoaded: state => state.loaded,
  error: state => state.error
}

export const mutations = {
  [SET_APP_LOADING](state, { loading }) {
    state.loading = loading
  },

  [SET_APP_LOADED](state, { loaded }) {
    state.loaded = loaded
  },

  [SET_APP_ERROR](state, { error }) {
    state.error = error
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
    commit(SET_APP_ERROR, { error: '' })
  },

  async setError({ commit }, error) {
    console.log('app/setError', error)

    commit(SET_APP_ERROR, { error })
  }
}
