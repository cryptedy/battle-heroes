import store from '@/store'

export default async (to, from, next) => {
  if (!store.getters['auth/check']) {
    try {
      await store.dispatch('auth/getPlayer')
    } catch (error) {
      //
    }
  }

  next()
}
