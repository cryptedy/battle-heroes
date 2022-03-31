import store from '@/store'

export default async (to, from, next) => {
  if (!store.getters['game/isLogin']) {
    try {
      await store.dispatch('game/login')
    } catch (error) {
      console.log(error)
    }
  }

  next()
}
