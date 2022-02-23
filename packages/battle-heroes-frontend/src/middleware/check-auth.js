import store from '@/store'

export default async (to, from, next) => {
  if (!store.getters['auth/check']) {
    try {
      await store.dispatch('auth/getUser')
    } catch (error) {
      //
    }
  }

  next()
}
