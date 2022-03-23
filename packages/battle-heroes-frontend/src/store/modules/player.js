import {
  ADD_PLAYER,
  SET_PLAYERS,
  UPDATE_PLAYER,
  DELETE_PLAYERS
} from '../mutation-types'

const initialState = () => ({
  entities: {},
  ids: []
})

export const state = initialState()

export const getters = {
  all: state => state.ids.map(id => state.entities[id]),
  find: state => id => state.entities[id],
  count: state => state.ids.length
}

export const mutations = {
  [SET_PLAYERS](state, { players }) {
    players.forEach(player => {
      state.entities = { ...state.entities, [player.id]: player }
    })
    state.ids = players.map(player => player.id)
  },

  [DELETE_PLAYERS](state) {
    const { entities, ids } = initialState()

    state.entities = entities
    state.ids = ids
  },

  [ADD_PLAYER](state, { player }) {
    state.entities = { ...state.entities, [player.id]: player }
    state.ids.push(player.id)
  },

  [UPDATE_PLAYER](state, { player }) {
    state.entities[player.id] = player
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
