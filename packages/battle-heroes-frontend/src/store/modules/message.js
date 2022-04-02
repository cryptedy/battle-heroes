import {
  SET_MESSAGES,
  DELETE_MESSAGES,
  ADD_MESSAGE,
  REMOVE_MESSAGE
} from '../mutation-types'

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
  },

  [REMOVE_MESSAGE](state, { messageId }) {
    delete state.entities[messageId]
    const index = state.ids.findIndex(id => id === messageId)
    if (index !== -1) state.ids.splice(index, 1)
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
  },

  remove({ commit }, messageId) {
    console.log('message/remove', messageId)

    commit(REMOVE_MESSAGE, { messageId })
  }
}
