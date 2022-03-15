const initialState = () => ({})

export const state = initialState()

export const getters = {
  isLogin: (state, getters, rootState, rootGetters) =>
    rootGetters['player/userPlayer'] !== null
}

export const mutations = {}

export const actions = {
  login({ dispatch, rootGetters }) {
    console.log('game/login', rootGetters['auth/user'])

    return new Promise((resolve, reject) => {
      this.$socket.emit(
        'game:login',
        rootGetters['auth/user'],
        async ({ status, players, messages }) => {
          if (!status) {
            return reject(status)
          }

          await dispatch('player/set', players, { root: true })
          await dispatch('chat/setMessages', messages, { root: true })

          resolve(status)
        }
      )
    })
  },

  async logout({ dispatch }) {
    console.log('game/logout')

    await dispatch('player/delete', null, { root: true })
    await dispatch('chat/deleteMessages', null, { root: true })

    return new Promise(resolve => {
      this.$socket.emit('game:logout', async () => {
        // ignore errors for logout
        resolve(true)
      })
    })
  }
}
