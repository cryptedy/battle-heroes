import socket from '@/utils/socket'
import * as types from '../mutation-types'

const initialState = () => ({
  connected: false
})

export const state = initialState()

export const getters = {
  connected: state => state.connected
}

export const mutations = {
  [types.RESET_SOCKET_STATE](state) {
    Object.assign(state, initialState())
  },

  [types.SET_CONNECTED](state, { connected }) {
    state.connected = connected
  }
}

export const actions = {
  reset({ commit }) {
    commit(types.RESET_SOCKET_STATE)
  },

  async onConnect({ commit }) {
    console.log('onConnect')

    commit(types.SET_CONNECTED, { connected: socket.connected })
  },

  async onDisconnect({ commit }) {
    console.log('onDisconnect')

    commit(types.SET_CONNECTED, { connected: socket.connected })
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

    commit(types.SET_CONNECTED, { connected: socket.connected })
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
