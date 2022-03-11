import {
  RESET_PLAYER_STATE,
  SET_PLAYERS,
  DELETE_PLAYERS
} from '../mutation-types'

const initialState = () => ({
  players: {},
  playerIds: []
})

export const state = initialState()

export const getters = {
  all: state => state.playerIds.map(playerId => state.players[playerId]),
  find: (state, getters) => playerId =>
    getters.all.find(player => player.id === playerId)
}

export const mutations = {
  [RESET_PLAYER_STATE](state) {
    Object.assign(state, initialState())
  },

  [SET_PLAYERS](state, { players }) {
    players.forEach(player => {
      state.players = { ...state.players, [player.id]: player }
    })

    state.playerIds = players.map(player => player.id)
  },

  [DELETE_PLAYERS](state) {
    const { players, ids } = initialState()

    state.players = players
    state.ids = ids
  }
}

export const actions = {
  reset({ commit }) {
    commit(RESET_PLAYER_STATE)
  },

  async setPlayers({ commit }, payload) {
    console.log('player/setPlayers', payload)

    commit(SET_PLAYERS, payload)
  }
}
