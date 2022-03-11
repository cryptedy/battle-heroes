import { RESET_CHAT_STATE, SET_MESSAGES, SET_MESSAGE } from '../mutation-types'

const initialState = () => ({
  messages: []
})

export const state = initialState()

export const getters = {
  messages: state => state.messages
}

export const mutations = {
  [RESET_CHAT_STATE](state) {
    Object.assign(state, initialState())
  },

  [SET_MESSAGES](state, { messages }) {
    state.messages = messages
  },

  [SET_MESSAGE](state, { player, text, posted_at }) {
    state.messages.push({ player, text, posted_at })
  }
}

export const actions = {
  reset({ commit }) {
    commit(RESET_CHAT_STATE)
  },

  setMessages({ commit }, { messages }) {
    console.log('chat/setMessages', { messages })

    commit(SET_MESSAGES, { messages })
  },

  setMessage({ commit }, { player, text, posted_at }) {
    console.log('chat/setMessage', { player, text, posted_at })

    commit(SET_MESSAGE, { player, text, posted_at })
  }
}
