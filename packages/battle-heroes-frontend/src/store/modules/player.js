import { SET_PLAYERS, DELETE_PLAYERS } from '../mutation-types'

const initialState = () => ({
  players: {},
  playerIds: []
})

export const state = initialState()

export const getters = {
  all: state => state.playerIds.map(playerId => state.players[playerId]),
  find: (state, getters) => playerId =>
    getters.all.find(player => player.id === playerId),
  count: (state, getters) => getters.all.length,
  userPlayer: (state, getters, rootState, rootGetters) => {
    if (!rootGetters['auth/isLogin']) return null

    return getters.find(rootGetters['auth/user'].id) || null
  }
}

export const mutations = {
  [SET_PLAYERS](state, { players }) {
    players.forEach(player => {
      state.players = { ...state.players, [player.id]: player }
    })

    state.playerIds = players.map(player => player.id)
  },

  [DELETE_PLAYERS](state) {
    const { players, playerIds } = initialState()

    state.players = players
    state.playerIds = playerIds
  }
}

export const actions = {
  async setPlayers({ commit }, players) {
    console.log('player/setPlayers', players)

    commit(SET_PLAYERS, { players })
  },

  async deletePlayers({ commit }) {
    console.log('player/deletePlayers')

    commit(DELETE_PLAYERS)
  }
}
