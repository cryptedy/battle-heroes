import { socket } from '@/plugins/socket'
import { BATTLE_TYPE, LOGIN_TIMEOUT } from '@/utils/constants'

const initialState = () => ({})

export const state = initialState()

export const mutations = {}

export const getters = {
  player: (state, getters, rootState, rootGetters) => {
    if (!rootGetters['auth/isLogin']) return

    return rootGetters['player/find'](rootGetters['auth/user'].id)
  },
  isLogin: (state, getters) => getters.player !== undefined,
  playerBattle: (state, getters, rootState, rootGetters) => {
    if (!getters.isLogin) return

    return rootGetters['battle/all'].find(
      battle =>
        battle.players[1].id === getters.player.id ||
        (battle.players[2].id === getters.player.id &&
          battle.type === BATTLE_TYPE.HUMAN)
    )
  },
  hasInvitation: (state, getters) => {
    if (!getters.playerBattle) return

    return (
      getters.playerBattle.players[1].id !== getters.player.id &&
      !getters.playerBattle.players[2].NFT_id
    )
  }
}

export const actions = {
  login({ dispatch, rootGetters }) {
    console.log('game/login', rootGetters['auth/user'])

    return new Promise((resolve, reject) => {
      socket
        .timeout(LOGIN_TIMEOUT)
        .emit('auth:login', rootGetters['auth/user'], (error, response) => {
          if (error) {
            return reject(error)
          } else {
            const { status, message, players, battles, messages } = response

            if (!status) {
              return reject(message)
            }

            dispatch('player/set', players, { root: true })
            dispatch('battle/set', battles, { root: true })
            dispatch('message/set', messages, { root: true })

            resolve(message)
          }
        })
    })
  },

  logout({ dispatch }) {
    console.log('game/logout')

    dispatch('player/reset', null, { root: true })
    dispatch('battle/reset', null, { root: true })
    dispatch('message/reset', null, { root: true })

    return new Promise(resolve => {
      socket.emit('auth:logout', () => {
        // ignore errors
        resolve(true)
      })
    })
  }
}
