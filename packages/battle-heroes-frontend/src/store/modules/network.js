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
  onOnline({ dispatch, commit }) {
    console.log('network/onOnline')

    dispatch('audio/resumeAll', null, { root: true })

    commit(SET_NETWORK_CONNECTED, { connected: true })
  },

  onOffline({ dispatch, commit }) {
    console.log('network/onOffline')

    dispatch('audio/pauseAll', null, { root: true })

    commit(SET_NETWORK_CONNECTED, { connected: false })
  }
}
