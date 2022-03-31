import { socket } from '@/plugins'
import {
  SET_SOCKET_CONNECTED,
  SET_SOCKET_RECONNECTING
} from '../mutation-types'

const initialState = () => ({
  connected: false,
  reconnecting: false
})

export const state = initialState()

export const getters = {
  isConnected: state => state.connected,
  isReconnecting: state => state.reconnecting
}

export const mutations = {
  [SET_SOCKET_CONNECTED](state, { connected }) {
    state.connected = connected
  },

  [SET_SOCKET_RECONNECTING](state, { reconnecting }) {
    state.reconnecting = reconnecting
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

  async onReconnecting({ commit }) {
    console.log('onReconnecting')

    commit(SET_SOCKET_RECONNECTING, { reconnecting: true })
  },

  async onReconnect({ commit }) {
    console.log('onReconnect')

    commit(SET_SOCKET_RECONNECTING, { reconnecting: false })
  }
}
