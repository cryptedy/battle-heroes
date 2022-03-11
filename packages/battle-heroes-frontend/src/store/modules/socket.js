import socket from '@/utils/socket'
import { RESET_SOCKET_STATE, SET_CONNECTED } from '../mutation-types'

const initialState = () => ({
  connected: false
})

export const state = initialState()

export const getters = {
  connected: state => state.connected
}

export const mutations = {
  [RESET_SOCKET_STATE](state) {
    Object.assign(state, initialState())
  },

  [SET_CONNECTED](state, { connected }) {
    state.connected = connected
  }
}

export const actions = {
  reset({ commit }) {
    commit(RESET_SOCKET_STATE)
  },

  async onConnect({ commit }) {
    console.log('onConnect')

    commit(SET_CONNECTED, { connected: socket.connected })
  },

  async onDisconnect({ commit }) {
    console.log('onDisconnect')

    commit(SET_CONNECTED, { connected: socket.connected })
  },

  // eslint-disable-next-line no-unused-vars
  async onConnectError({ commit }, { error }) {
    console.log('onConnectError', error)
  },

  // eslint-disable-next-line no-unused-vars
  async onError({ commit }, { error }) {
    console.log('onError', error)
  },

  // eslint-disable-next-line no-unused-vars
  async onReconnect({ commit }, { attempt }) {
    console.log('onReconnect', attempt)

    commit(SET_CONNECTED, { connected: socket.connected })
  },

  // eslint-disable-next-line no-unused-vars
  async onReconnectAttempt({ commit }, { attempt }) {
    console.log('onReconnectAttempt', attempt)
  },

  // eslint-disable-next-line no-unused-vars
  async onReconnectError({ commit }, { error }) {
    console.log('onReconnectError', error)
  },

  // eslint-disable-next-line no-unused-vars
  async onReconnectFailed({ commit }) {
    console.log('onReconnectFailed')
  }
}
