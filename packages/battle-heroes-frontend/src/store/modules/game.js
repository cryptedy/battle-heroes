import { socket } from '@/plugins/socket'

const initialState = () => ({})

export const state = initialState()

export const getters = {
  isLogin: (state, getters) => getters.player !== null,
  player: (state, getters, rootState, rootGetters) => {
    if (!rootGetters['auth/isLogin']) return null

    return rootGetters['player/find'](rootGetters['auth/user'].id) || null
  },
  battle: (state, getters, rootState, rootGetters) => {
    if (!getters.isLogin) return null

    return (
      rootGetters['battle/all'].find(
        battle =>
          battle.player1.id === getters.player.id ||
          (battle.player2 && battle.player2.id === getters.player.id)
      ) || null
    )
  }
}

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

          dispatch('addEventListeners')

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

    dispatch('removeEventListeners')

    await dispatch('player/reset', null, { root: true })
    await dispatch('battle/reset', null, { root: true })
    await dispatch('message/reset', null, { root: true })

    return new Promise(resolve => {
      socket.emit('game:logout', async () => {
        // ignore logout errors
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
