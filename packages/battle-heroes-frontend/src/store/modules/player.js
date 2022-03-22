import {
  ADD_PLAYER,
  SET_PLAYERS,
  UPDATE_PLAYER,
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
    getters.all.find(player => player.id === playerId),
  count: (state, getters) => getters.all.length
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
  },

  [ADD_PLAYER](state, { player }) {
    state.players = { ...state.players, [player.id]: player }

    state.playerIds.push(player.id)
  },

  [UPDATE_PLAYER](state, { player }) {
    state.players[player.id] = player
  }
}

export const actions = {
  async set({ commit }, players) {
    console.log('player/set', players)

    commit(SET_PLAYERS, { players })
  },

  async delete({ commit }) {
    console.log('player/delete')

    commit(DELETE_PLAYERS)
  },

  async add({ commit }, player) {
    console.log('player/add', player)

    commit(ADD_PLAYER, { player })
  },

  async update({ commit }, player) {
    console.log('player/update', player)

    commit(UPDATE_PLAYER, { player })
  }
}
