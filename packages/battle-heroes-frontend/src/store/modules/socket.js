import { socket } from '@/plugins'
import { SET_SOCKET_CONNECTED } from '../mutation-types'

const initialState = () => ({
  connected: false
})

export const state = initialState()

export const getters = {
  isConnected: state => state.connected
}

export const mutations = {
  [SET_SOCKET_CONNECTED](state, { connected }) {
    state.connected = connected
  }
}

export const actions = {
  async onConnect({ commit }) {
    console.log('onConnect')

    commit(SET_SOCKET_CONNECTED, { connected: socket.connected })
  },

  async onDisconnect({ commit }) {
    console.log('onDisconnect')

    commit(SET_SOCKET_CONNECTED, { connected: socket.connected })
  },

  async onConnectError(context, error) {
    console.log('onConnectError', error)
  },

  async onError(context, error) {
    console.log('onError', error)
  },

  async onReconnect(context, attempt) {
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
