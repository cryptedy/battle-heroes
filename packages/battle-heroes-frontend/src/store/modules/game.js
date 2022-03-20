import { SET_GAMES, DELETE_GAMES } from '../mutation-types'

const initialState = () => ({
  games: []
})

export const state = initialState()

export const getters = {
  all: state => state.games,
  count: state => state.games.length
}

export const mutations = {
  [SET_GAMES](state, { games }) {
    state.games = games
  },

  [DELETE_GAMES](state) {
    const { games } = initialState()

    state.games = games
  }
}

export const actions = {
  set({ commit }, games) {
    console.log('game/set', games)

    commit(SET_GAMES, { games })
  },

  delete({ commit }) {
    console.log('game/delete')

    commit(DELETE_GAMES)
  },

  login({ dispatch, rootGetters }) {
    console.log('game/login', rootGetters['auth/user'])

    return new Promise((resolve, reject) => {
      this.$socket.emit(
        'game:login',
        rootGetters['auth/user'],
        async ({ status, players, messages, games }) => {
          if (!status) {
            return reject(status)
          }

          await dispatch('player/set', players, { root: true })
          await dispatch('message/set', messages, { root: true })
          await dispatch('set', games)

          resolve(status)
        }
      )
    })
  },

  async logout({ dispatch }) {
    console.log('game/logout')

    await dispatch('player/delete', null, { root: true })
    await dispatch('message/delete', null, { root: true })
    await dispatch('delete')

    return new Promise(resolve => {
      this.$socket.emit('game:logout', async () => {
        // ignore errors for logout
        resolve(true)
      })
    })
  }
}
