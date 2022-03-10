import * as types from '../mutation-types'

const initialState = () => ({
  messages: []
})

export const state = initialState()

export const getters = {
  messages: state => state.messages
}

export const mutations = {
  [types.RESET_CHAT_STATE](state) {
    Object.assign(state, initialState())
  },

  [types.SET_MESSAGES](state, { messages }) {
    state.messages = messages
  },

  [types.SET_MESSAGE](state, { player, text, posted_at }) {
    state.messages.push({ player, text, posted_at })
  }
}

export const actions = {
  reset({ commit }) {
    commit(types.RESET_CHAT_STATE)
  },

  setMessages({ commit }, { messages }) {
    console.log('chat/setMessages', { messages })

    commit(types.SET_MESSAGES, { messages })
  },

  setMessage({ commit }, { player, text, posted_at }) {
    console.log('chat/setMessage', { player, text, posted_at })

    commit(types.SET_MESSAGE, { player, text, posted_at })
  }
}
