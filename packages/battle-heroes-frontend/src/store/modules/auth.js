import Moralis from 'moralis/dist/moralis.min.js'
import { SET_USER, DELETE_USER } from '../mutation-types'

const SIGNING_MESSAGE = `Login to ${process.env.VUE_APP_TITLE}`

const createUser = MoralisUser => {
  return {
    id: MoralisUser.id,
    address: MoralisUser.get('ethAddress')
  }
}

const initialState = () => ({
  user: null
})

export const state = initialState()

export const getters = {
  user: state => state.user,
  isLogin: (state, getters) => getters.user !== null
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
      const MoralisUser = await Moralis.authenticate({
        signingMessage: SIGNING_MESSAGE
      })

      if (MoralisUser) {
        const user = createUser(MoralisUser)

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
      const MoralisUser = Moralis.User.current()

      if (MoralisUser) {
        const user = createUser(MoralisUser)

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
