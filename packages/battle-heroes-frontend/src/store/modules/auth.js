import Moralis from 'moralis/dist/moralis.min.js'
import { SET_USER, DELETE_USER } from '../mutation-types'

const SIGNING_MESSAGE = `Login to ${process.env.VUE_APP_TITLE}`

const createUser = moralisUser => {
  return {
    id: moralisUser.id,
    address: moralisUser.get('ethAddress')
  }
}

const initialState = () => ({
  user: null
})

export const state = initialState()

export const getters = {
  user: state => state.user,
  isLogin: (state, getters) => getters.user !== null,
  player: (state, getters, rootState, rootGetters) => {
    if (!getters.isLogin) return null

    return rootGetters['player/find'](getters.user.id) || null
  },
  isGameLogin: (state, getters) => getters.player !== null,
  game: (state, getters, rootState, rootGetters) => {
    if (!getters.isGameLogin) return null

    return (
      rootGetters['game/all'].find(game =>
        game.player_ids.includes(getters.player.id)
      ) || null
    )
  }
}

export const mutations = {
  [SET_USER](state, { user }) {
    state.user = user
  },

  [DELETE_USER](state) {
    const { user } = initialState()
    state.user = user
  }
}

export const actions = {
  async login({ commit }) {
    console.log('auth/login')

    try {
      const moralisUser = await Moralis.authenticate({
        signingMessage: SIGNING_MESSAGE
      })

      if (moralisUser) {
        const user = createUser(moralisUser)

        commit(SET_USER, { user })
      }
    } catch (error) {
      commit(DELETE_USER)

      throw new Error(error)
    }
  },

  async loginWithToken({ commit }) {
    console.log('auth/loginWithToken')

    try {
      const moralisUser = Moralis.User.current()

      if (moralisUser) {
        const user = createUser(moralisUser)

        commit(SET_USER, { user })
      }
    } catch (error) {
      commit(DELETE_USER)

      throw new Error(error)
    }
  },

  async logout({ commit }) {
    console.log('auth/logout')

    try {
      await Moralis.User.logOut()
    } catch (error) {
      throw new Error(error)
    } finally {
      commit(DELETE_USER)
    }
  }
}
