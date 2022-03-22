import { SET_BATTLES, DELETE_BATTLES, ADD_BATTLE } from '../mutation-types'

const initialState = () => ({
  battles: []
})

export const state = initialState()

export const getters = {
  all: state => state.battles,
  count: state => state.battles.length
}

export const mutations = {
  [SET_BATTLES](state, { battles }) {
    state.battles = battles
  },

  [DELETE_BATTLES](state) {
    const { battles } = initialState()

    state.battles = battles
  },

  [ADD_BATTLE](state, { battle }) {
    state.battles.push(battle)
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
  }
}
