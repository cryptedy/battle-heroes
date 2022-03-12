import { SET_MESSAGES, DELETE_MESSAGES, ADD_MESSAGE } from '../mutation-types'

const initialState = () => ({
  messages: []
})

export const state = initialState()

export const getters = {
  messages: state => state.messages
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
    const { player, text, posted_at } = message

    state.messages.push({ player, text, posted_at })
  }
}

export const actions = {
  setMessages({ commit }, messages) {
    console.log('chat/setMessages', messages)

    commit(SET_MESSAGES, { messages })
  },

  async deleteMessages({ commit }) {
    console.log('chat/deleteMessages')

    commit(DELETE_MESSAGES)
  },

  addMessage({ commit }, message) {
    console.log('chat/addMessage', message)

    commit(ADD_MESSAGE, { message })
  }
}
