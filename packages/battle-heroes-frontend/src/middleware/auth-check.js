import store from '@/store'

export default async (to, from, next) => {
  if (!store.getters['auth/isLogin']) {
    try {
      store.dispatch('auth/loginWithToken')
    } catch (error) {
      throw new Error(error)
    }
  }

  next()
}
