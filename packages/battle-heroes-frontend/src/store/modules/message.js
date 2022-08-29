import {
  RESET_MESSAGES,
  SET_MESSAGES,
  ADD_MESSAGE,
  REMOVE_MESSAGE,
  SET_UNREAD_MESSAGE
} from '../mutation-types'

const initialState = () => ({
  entities: {},
  ids: [],
  unread: 0
})

export const state = initialState()

export const getters = {
  all: state => state.ids.map(id => state.entities[id]),
  unreadCount: state => state.unread
}

export const mutations = {
  [RESET_MESSAGES](state) {
    const { entities, ids } = initialState()

    state.entities = entities
    state.ids = ids
  },

  [SET_MESSAGES](state, { messages }) {
    messages.forEach(message => {
      state.entities = { ...state.entities, [message.id]: message }
    })
    state.ids = messages.map(message => message.id)
  },

  [ADD_MESSAGE](state, { message }) {
    state.entities = { ...state.entities, [message.id]: message }

    const index = state.ids.findIndex(id => id === message.id)
    if (index === -1) state.ids.push(message.id)
  },

  [REMOVE_MESSAGE](state, { messageId }) {
    const index = state.ids.findIndex(id => id === messageId)
    if (index !== -1) state.ids.splice(index, 1)

    delete state.entities[messageId]
  },

  [SET_UNREAD_MESSAGE](state, { unread }) {
    state.unread = unread
  }
}

export const actions = {
  reset({ commit }) {
    console.log('message/reset')

    commit(RESET_MESSAGES)
  },

  set({ commit }, messages) {
    console.log('message/set', messages)

    commit(SET_MESSAGES, { messages })
  },

  add({ commit }, message) {
    console.log('message/add', message)

    commit(ADD_MESSAGE, { message })
  },

  remove({ commit }, messageId) {
    console.log('message/remove', messageId)

    commit(REMOVE_MESSAGE, { messageId })
  },

  resetUnread({ commit }) {
    console.log('message/resetUnread')

    commit(SET_UNREAD_MESSAGE, { unread: 0 })
  },

  incrementUnread({ state, commit }) {
    console.log('message/incrementUnread')

    const unread = state.unread + 1

    commit(SET_UNREAD_MESSAGE, { unread })
  }
}
