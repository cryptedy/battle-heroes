import { socket } from '@/plugins/socket'

const initialState = () => ({})

export const state = initialState()

export const getters = {
  isLogin: (sstate, getters) => getters.player !== null,
  player: (state, getters, rootState, rootGetters) => {
    if (!rootGetters['auth/isLogin']) return null

    return rootGetters['player/find'](rootGetters['auth/user'].id) || null
  },
  battle: (state, getters, rootState, rootGetters) =>
    rootGetters['battle/all'].find(
      battle => battle.player.id === getters.player.id
    )
}

export const mutations = {}

export const actions = {
  login({ dispatch, rootGetters }) {
    console.log('game/login', rootGetters['auth/user'])

    return new Promise((resolve, reject) => {
      socket.emit(
        'game:login',
        rootGetters['auth/user'],
        async ({ status, players, battles, messages }) => {
          if (!status) {
            return reject(status)
          }

          await dispatch('player/set', players, { root: true })
          await dispatch('battle/set', battles, { root: true })
          await dispatch('message/set', messages, { root: true })

          resolve(status)
        }
      )
    })
  },

  async logout({ dispatch }) {
    console.log('game/logout')

    await dispatch('player/delete', null, { root: true })
    await dispatch('battle/delete', null, { root: true })
    await dispatch('message/delete', null, { root: true })

    return new Promise(resolve => {
      socket.emit('game:logout', async () => {
        // ignore logout errors
        resolve(true)
      })
    })
  }
}
