import {
  RESET_PLAYERS,
  SET_PLAYERS,
  ADD_PLAYER,
  UPDATE_PLAYER
} from '../mutation-types'
import { PLAYER_TYPE } from '@/utils/constants'

const initialState = () => ({
  entities: {},
  ids: []
})

export const state = initialState()

export const getters = {
  all: state => state.ids.map(id => state.entities[id]),
  find: state => id => state.entities[id],
  count: state => state.ids.length,
  allHuman: (state, getters) =>
    getters.all.filter(player => player.type === PLAYER_TYPE.HUMAN)
}

export const mutations = {
  [RESET_PLAYERS](state) {
    const { entities, ids } = initialState()

    state.entities = entities
    state.ids = ids
  },

  [SET_PLAYERS](state, { players }) {
    players.forEach(player => {
      state.entities = { ...state.entities, [player.id]: player }
    })
    state.ids = players.map(player => player.id)
  },

  [ADD_PLAYER](state, { player }) {
    state.entities = { ...state.entities, [player.id]: player }

    const index = state.ids.findIndex(id => id === player.id)
    if (index === -1) state.ids.push(player.id)
  },

  [UPDATE_PLAYER](state, { player }) {
    state.entities[player.id] = player
  }
}

export const actions = {
  reset({ commit }) {
    console.log('player/reset')

    commit(RESET_PLAYERS)
  },

  set({ commit }, players) {
    console.log('player/set', players)

    commit(SET_PLAYERS, { players })
  },

  add({ commit }, player) {
    console.log('player/add', player)

    commit(ADD_PLAYER, { player })
  },

  update({ commit }, player) {
    console.log('player/update', player)

    commit(UPDATE_PLAYER, { player })
  }
}
