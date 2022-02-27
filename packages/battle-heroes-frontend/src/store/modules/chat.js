import * as types from '../mutation-types'

const initialState = () => ({
  users: [],
  messages: []
})

export const state = initialState()

export const getters = {
  users: state => state.users,
  messages: state => state.messages
}

export const mutations = {
  [types.SET_CHAT_USERS](state, { users }) {
    state.users = users
  },

  [types.SET_CHAT_MESSAGE](state, { user, text }) {
    state.messages.push({ user, text })
  }
}

export const actions = {
  async setUsers({ commit }, { users }) {
    console.log('chat/setUsers', users)

    commit(types.SET_CHAT_USERS, { users })
  },

  setMessage({ commit }, { user, text }) {
    console.log('chat/setMessage', { user, text })

    commit(types.SET_CHAT_MESSAGE, { user, text })
  }
}
