import * as types from '../mutation-types'

const initialState = () => ({
  players: []
})

export const state = initialState()

export const getters = {
  players: state => state.players
}

export const mutations = {
  [types.RESET_GAME_STATE](state) {
    Object.assign(state, initialState())
  },

  [types.SET_PLAYERS](state, { players }) {
    state.players = players
  },

  [types.DELETE_PLAYERS](state) {
    const { players } = initialState()
    state.players = players
  }
}

export const actions = {
  reset({ commit }) {
    commit(types.RESET_GAME_STATE)
  },

  async setPlayers({ commit }, payload) {
    console.log('game/setPlayers', payload)

    commit(types.SET_PLAYERS, payload)
  }
}
