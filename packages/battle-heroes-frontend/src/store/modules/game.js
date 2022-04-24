import { socket } from '@/plugins/socket'
import { LOGIN_TIMEOUT } from '@/utils/constants'

const initialState = () => ({})

export const state = initialState()

export const mutations = {}

export const getters = {
  player: (state, getters, rootState, rootGetters) => {
    if (!rootGetters['auth/isLogin']) return null

    return rootGetters['player/find'](rootGetters['auth/user'].id) || null
  },
  isLogin: (state, getters) => getters.player !== null,
  playerBattle: (state, getters, rootState, rootGetters) => {
    if (!getters.isLogin) return null

    return (
      rootGetters['battle/all'].find(
        battle =>
          battle.players[1].id === getters.player.id ||
          battle.players[2].id === getters.player.id
      ) || null
    )
  }
}

export const actions = {
  // eslint-disable-next-line no-unused-vars
  login({ dispatch, rootGetters }) {
    console.log('game/login', rootGetters['auth/user'])

    return new Promise((resolve, reject) => {
      socket
        .timeout(LOGIN_TIMEOUT)
        .emit('game:login', rootGetters['auth/user'], (error, response) => {
          if (error) {
            return reject(error)
          } else {
            const { status, players, battles, messages } = response

            if (!status) {
              return reject(status)
            }

            dispatch('addEventListeners')
            dispatch('player/set', players, { root: true })
            dispatch('battle/set', battles, { root: true })
            dispatch('message/set', messages, { root: true })

            resolve(status)
          }
        })
    })
  },

  logout({ dispatch }) {
    console.log('game/logout')

    dispatch('removeEventListeners')
    dispatch('player/reset', null, { root: true })
    dispatch('battle/reset', null, { root: true })
    dispatch('message/reset', null, { root: true })

    return new Promise(resolve => {
      socket.emit('game:logout', () => {
        // ignore logout error
        resolve(true)
      })
    })
  },

  addEventListeners({ dispatch }) {
    console.log('addEventListeners')

    socket.on('player:players', players =>
      dispatch('player/set', players, { root: true })
    )
    socket.on('player:player', player =>
      dispatch('player/add', player, { root: true })
    )
    socket.on('player:update', player =>
      dispatch('player/update', player, { root: true })
    )
    socket.on('battle:battles', battles =>
      dispatch('battle/set', battles, { root: true })
    )
    socket.on('battle:battle', battle =>
      dispatch('battle/add', battle, { root: true })
    )
    socket.on('battle:update', battle =>
      dispatch('battle/update', battle, { root: true })
    )
    socket.on('battle:delete', battleId =>
      dispatch('battle/remove', battleId, { root: true })
    )
    socket.on('message:messages', messages =>
      dispatch('message/set', messages, { root: true })
    )
    socket.on('message:message', message =>
      dispatch('message/add', message, { root: true })
    )
    socket.on('message:delete', messageId =>
      dispatch('message/remove', messageId, { root: true })
    )
  },

  removeEventListeners() {
    console.log('removeEventListeners')

    socket.off('player:players')
    socket.off('player:player')
    socket.off('player:update')
    socket.off('battle:battles')
    socket.off('battle:battle')
    socket.off('battle:update')
    socket.off('battle:delete')
    socket.off('message:messages')
    socket.off('message:message')
    socket.off('message:delete')
  }
}
