import store from '@/store'

export default async (to, from, next) => {
  if (!store.getters['socket/isConnected']) {
    store.dispatch('socket/connect')
  }

  if (!store.getters['game/isLogin']) {
    await store.dispatch('game/login')
  }

  next()
}
