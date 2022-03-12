import socket from '@/utils/socket'
import { SET_CONNECTED } from '../mutation-types'

const initialState = () => ({
  connected: false
})

export const state = initialState()

export const getters = {
  connected: state => state.connected
}

export const mutations = {
  [SET_CONNECTED](state, { connected }) {
    state.connected = connected
  }
}

export const actions = {
  async onConnect({ commit }) {
    console.log('onConnect')

    commit(SET_CONNECTED, { connected: socket.connected })
  },

  async onDisconnect({ commit }) {
    console.log('onDisconnect')

    commit(SET_CONNECTED, { connected: socket.connected })
  },

  async onConnectError(context, error) {
    console.log('onConnectError', error)
  },

  async onError(context, error) {
    console.log('onError', error)
  },

  // eslint-disable-next-line no-unused-vars
  async onReconnect({ commit, dispatch, rootGetters }, attempt) {
    console.log('onReconnect', attempt)
  },

  async onReconnectAttempt(context, attempt) {
    console.log('onReconnectAttempt', attempt)
  },

  async onReconnectError(context, error) {
    console.log('onReconnectError', error)
  },

  async onReconnectFailed() {
    console.log('onReconnectFailed')
  }
}
