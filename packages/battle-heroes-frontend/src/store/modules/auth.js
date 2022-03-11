import axios from 'axios'
import * as types from '../mutation-types'
import { API_URL } from '@/utils/constants'
import Moralis from 'moralis/dist/moralis.min.js'

const SIGNING_MESSAGE = `Login to ${process.env.VUE_APP_TITLE}`

const createUser = async MoralisUser => {
  const address = MoralisUser.get('ethAddress')

  const { data: profile } = await axios.get(`${API_URL}/users/${address}`)

  return {
    id: MoralisUser.id,
    address: address,
    name: profile.name,
    image_url: profile.image_url
  }
}

const createPlayer = (socket, user) => {
  return new Promise((resolve, reject) => {
    socket.emit('game:join', { user }, payload => {
      const { status, message, player } = payload

      if (!status) return reject(message)

      resolve(player)
    })
  })
}

const initialState = () => ({
  player: null
})

export const state = initialState()

export const getters = {
  player: state => state.player,
  check: (state, getters) => getters.player !== null
}

export const mutations = {
  [types.RESET_AUTH_STATE](state) {
    Object.assign(state, initialState())
  },

  [types.SET_PLAYER](state, { player }) {
    state.player = player
  },

  [types.DELETE_PLAYER](state) {
    const { player } = initialState()
    state.player = player
  }
}

export const actions = {
  reset({ commit }) {
    commit(types.RESET_AUTH_STATE)
  },

  async login({ commit }) {
    try {
      const MoralisUser = await Moralis.authenticate({
        signingMessage: SIGNING_MESSAGE
      })

      const user = await createUser(MoralisUser)

      const player = await createPlayer(this.$socket, user)

      commit(types.SET_PLAYER, { player })
    } catch (error) {
      commit(types.DELETE_PLAYER)

      throw new Error(error)
    }
  },

  async getPlayer({ commit }) {
    try {
      const MoralisUser = Moralis.User.current()

      const user = await createUser(MoralisUser)

      const player = await createPlayer(this.$socket, user)

      commit(types.SET_PLAYER, { player })
    } catch (error) {
      commit(types.DELETE_PLAYER)

      throw new Error(error)
    }
  },

  async logout({ commit }) {
    try {
      await Moralis.User.logOut()
    } catch (error) {
      throw new Error(error)
    } finally {
      commit(types.DELETE_PLAYER)
    }
  }
}
