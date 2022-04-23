import { SET_NETWORK_CONNECTED } from '../mutation-types'

const initialState = () => ({
  connected: true
})

export const state = initialState()

export const getters = {
  isOnline: state => state.connected
}

export const mutations = {
  [SET_NETWORK_CONNECTED](state, { connected }) {
    state.connected = connected
  }
}

export const actions = {
  onOnline({ commit }) {
    console.log('network/onOnline')

    commit(SET_NETWORK_CONNECTED, { connected: true })
  },

  onOffline({ commit }) {
    console.log('network/onOffline')

    commit(SET_NETWORK_CONNECTED, { connected: false })
  }
}
