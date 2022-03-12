import store from '@/store'

export default async (to, from, next) => {
  if (!store.getters['auth/isLogin']) {
    try {
      await store.dispatch('auth/loginWithToken')
    } catch (error) {
      throw new Error(error)
    }
  }

  next()
}
