import * as types from '../mutation-types'
import AuthService from '@/services/AuthService'

const initialState = () => ({
  user: null
})

export const state = initialState()

export const getters = {
  user: state => state.user,
  check: (state, getters) => getters.user !== null
}

export const mutations = {
  [types.RESET_AUTH_STATE](state) {
    Object.assign(state, initialState())
  },

  [types.SET_USER](state, { user }) {
    state.user = user
  },

  [types.DELETE_USER](state) {
    const { user } = initialState()
    state.user = user
  }
}

export const actions = {
  reset({ commit }) {
    commit(types.RESET_AUTH_STATE)
  },

  async login({ commit, dispatch }) {
    try {
      const user = await AuthService.login()

      if (user) {
        commit(types.SET_USER, { user })

        await dispatch(
          'NFT/getNFTsForAddress',
          {
            address: user.address
          },
          {
            root: true
          }
        )
      }
    } catch (error) {
      commit(types.DELETE_USER)

      throw new Error(error)
    }
  },

  async getUser({ commit, dispatch }) {
    try {
      const user = await AuthService.getUser()

      if (user) {
        await dispatch(
          'NFT/getNFTsForAddress',
          {
            address: user.address
          },
          {
            root: true
          }
        )

        commit(types.SET_USER, { user })
      }
    } catch (error) {
      commit(types.DELETE_USER)

      throw new Error(error)
    }
  },

  async logout({ commit }) {
    try {
      await AuthService.logout()
    } catch (error) {
      throw new Error(error)
    } finally {
      commit(types.DELETE_USER)
    }
  }
}
