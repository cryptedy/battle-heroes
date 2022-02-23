import * as types from '../mutation-types'

const initialState = () => {
  return {
    initialized: false
  }
}

export const state = initialState()

export const getters = {
  initialized: state => state.initialized
}

export const mutations = {
  [types.APP_INITIALIZED](state) {
    state.initialized = true
  }
}

export const actions = {
  async initialized({ commit }) {
    commit(types.APP_INITIALIZED)
  }
}
