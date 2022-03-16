import { SET_MESSAGES, DELETE_MESSAGES, ADD_MESSAGE } from '../mutation-types'

const initialState = () => ({
  messages: []
})

export const state = initialState()

export const getters = {
  all: state => state.messages
}

export const mutations = {
  [SET_MESSAGES](state, { messages }) {
    state.messages = messages
  },

  [DELETE_MESSAGES](state) {
    const { messages } = initialState()

    state.messages = messages
  },

  [ADD_MESSAGE](state, { message }) {
    state.messages.push(message)
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
