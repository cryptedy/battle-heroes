import {
  SET_BATTLES,
  DELETE_BATTLES,
  ADD_BATTLE,
  UPDATE_BATTLE,
  REMOVE_BATTLE
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
  [SET_BATTLES](state, { battles }) {
    battles.forEach(battle => {
      state.entities = { ...state.entities, [battle.id]: battle }
    })
    state.ids = battles.map(battle => battle.id)
  },

  [DELETE_BATTLES](state) {
    const { entities, ids } = initialState()

    state.entities = entities
    state.ids = ids
  },

  [ADD_BATTLE](state, { battle }) {
    state.entities = { ...state.entities, [battle.id]: battle }
    state.ids.push(battle.id)
  },

  [UPDATE_BATTLE](state, { battle }) {
    state.entities[battle.id] = battle
  },

  [REMOVE_BATTLE](state, { battleId }) {
    delete state.entities[battleId]
    const index = state.ids.findIndex(id => id === battleId)
    if (index !== -1) state.ids.splice(index, 1)
  }
}

export const actions = {
  set({ commit }, battles) {
    console.log('battle/set', battles)

    commit(SET_BATTLES, { battles })
  },

  delete({ commit }) {
    console.log('battle/delete')

    commit(DELETE_BATTLES)
  },

  add({ commit }, battle) {
    console.log('battle/add', battle)

    commit(ADD_BATTLE, { battle })
  },

  update({ commit }, battle) {
    console.log('battle/update', battle)

    commit(UPDATE_BATTLE, { battle })
  },

  remove({ commit }, battleId) {
    console.log('battle/remove', battleId)

    commit(REMOVE_BATTLE, { battleId })
  }
}
