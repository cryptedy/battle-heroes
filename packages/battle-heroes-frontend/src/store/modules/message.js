import { SET_MESSAGES, DELETE_MESSAGES, ADD_MESSAGE } from '../mutation-types'

const initialState = () => ({
  entities: {},
  ids: []
})

export const state = initialState()

export const getters = {
  all: state => state.ids.map(id => state.entities[id])
}

export const mutations = {
  [SET_MESSAGES](state, { messages }) {
    messages.forEach(message => {
      state.entities = { ...state.entities, [message.id]: message }
    })
    state.ids = messages.map(message => message.id)
  },

  [DELETE_MESSAGES](state) {
    const { entities, ids } = initialState()

    state.entities = entities
    state.ids = ids
  },

  [ADD_MESSAGE](state, { message }) {
    state.entities = { ...state.entities, [message.id]: message }
    state.ids.push(message.id)
  }
}

export const actions = {
  set({ commit }, messages) {
    console.log('message/set', messages)

    commit(SET_MESSAGES, { messages })
  },

  delete({ commit }) {
    console.log('message/delete')

    commit(DELETE_MESSAGES)
  },

  add({ commit }, message) {
    console.log('message/add', message)

    commit(ADD_MESSAGE, { message })
  }
}
