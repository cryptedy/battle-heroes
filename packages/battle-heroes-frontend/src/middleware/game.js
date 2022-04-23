import store from '@/store'
import { socket } from '@/plugins/socket'

export default async (to, from, next) => {
  if (!socket.connected) {
    socket.connect()
  }

  if (!store.getters['game/isLogin']) {
    try {
      await store.dispatch('game/login')
    } catch (error) {
      console.log(error)

      store.dispatch('game/logout')
    }
  }

  next()
}
