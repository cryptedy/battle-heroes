import store from '@/store'
import { socket } from '@/plugins/socket'

const addEventListeners = () => {
  console.log('addEventListeners')

  socket.on('player:players', players => store.dispatch('player/set', players))
  socket.on('player:player', player => store.dispatch('player/add', player))
  socket.on('player:update', player => store.dispatch('player/update', player))
  socket.on('battle:battles', battles => store.dispatch('battle/set', battles))
  socket.on('battle:battle', battle => store.dispatch('battle/add', battle))
  socket.on('message:messages', messages =>
    store.dispatch('message/set', messages)
  )
  socket.on('message:message', message =>
    store.dispatch('message/add', message)
  )
}

const removeEventListeners = () => {
  console.log('removeEventListeners')

  socket.off('player:players')
  socket.off('player:player')
  socket.off('player:update')
  socket.off('battle:battles')
  socket.off('battle:battle')
  socket.off('message:messages')
  socket.off('message:message')
}

const onSocketConnect = async () => {
  console.log('onSocketConnect')

  addEventListeners()

  if (!store.getters['game/isLogin']) {
    try {
      await store.dispatch('game/login')
    } catch (error) {
      console.log(error)
    }
  }
}

const onSocketDisconnect = async () => {
  console.log('onSocketDisconnect')

  removeEventListeners()

  if (store.getters['game/isLogin']) {
    try {
      store.dispatch('game/logout')
    } catch (error) {
      console.log(error)
    }
  }
}

export default async (to, from, next) => {
  if (!store.getters['game/isLogin']) {
    try {
      await store.dispatch('game/login')

      addEventListeners()

      socket.on('connect', () => onSocketConnect())
      socket.on('disconnect', () => onSocketDisconnect())
    } catch (error) {
      console.log(error)
    }
  }

  next()
}
