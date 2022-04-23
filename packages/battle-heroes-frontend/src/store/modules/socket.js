import { socket } from '@/plugins'
import {
  SET_SOCKET_CONNECTED,
  SET_SOCKET_CONNECTING,
  SET_SOCKET_CONNECT_ERROR,
  SET_SOCKET_ERROR
} from '../mutation-types'
import { NOTIFICATION_TYPE } from '@/utils/constants'

const initialState = () => ({
  connected: false,
  connecting: false,
  connectError: '',
  disconnectReason: '',
  error: ''
})

export const state = initialState()

export const getters = {
  isConnected: state => state.connected,
  isConnecting: state => state.connecting,
  connectError: state => state.connectError,
  error: state => state.error
}

export const mutations = {
  [SET_SOCKET_CONNECTED](state, { connected }) {
    state.connected = connected
  },

  [SET_SOCKET_CONNECTING](state, { connecting }) {
    state.connecting = connecting
  },

  [SET_SOCKET_CONNECT_ERROR](state, { error }) {
    state.connectError = error
  },

  [SET_SOCKET_ERROR](state, { error }) {
    state.error = error
  }
}

export const actions = {
  connect({ commit }) {
    console.log('socket/connect')

    commit(SET_SOCKET_ERROR, { error: '' })
    commit(SET_SOCKET_CONNECT_ERROR, { error: '' })
    commit(SET_SOCKET_CONNECTING, { connecting: true })

    socket.connect()
  },

  // eslint-disable-next-line no-unused-vars
  disconnect(context) {
    console.log('socket/connect')

    socket.disconnect()
  },

  onConnect({ commit }) {
    console.log('socket/onConnect')

    commit(SET_SOCKET_CONNECTED, { connected: socket.connected })
    commit(SET_SOCKET_CONNECTING, { connecting: false })
    commit(SET_SOCKET_CONNECT_ERROR, { error: '' })
    commit(SET_SOCKET_ERROR, { error: '' })
  },

  onDisconnect({ commit, dispatch }, reason) {
    console.log('socket/onDisconnect', reason)

    commit(SET_SOCKET_CONNECTED, { connected: socket.connected })
    commit(SET_SOCKET_CONNECTING, { connecting: false })

    dispatch(
      'notification/add',
      {
        message: `socket disconnect: ${reason}`,
        type: NOTIFICATION_TYPE.ERROR,
        timeout: 0
      },
      { root: true }
    )

    dispatch('game/logout', null, { root: true })
  },

  onConnectError({ commit, dispatch }, error) {
    console.log('socket/onConnectError', error)

    commit(SET_SOCKET_CONNECT_ERROR, { error: error.message })
    commit(SET_SOCKET_CONNECTING, { connecting: false })

    dispatch(
      'notification/add',
      {
        message: `socket connect error: ${error.message}`,
        type: NOTIFICATION_TYPE.ERROR,
        timeout: 0
      },
      { root: true }
    )
  },

  onError({ commit, dispatch }, error) {
    console.log('socket/onError', error)

    commit(SET_SOCKET_ERROR, { error: error.message })
    commit(SET_SOCKET_CONNECTING, { connecting: false })

    dispatch(
      'notification/add',
      {
        message: `socket error: ${error.message}`,
        type: NOTIFICATION_TYPE.ERROR,
        timeout: 0
      },
      { root: true }
    )
  }
}
