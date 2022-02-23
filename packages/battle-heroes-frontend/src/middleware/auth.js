import store from '@/store'

export default async (to, from, next) => {
  if (!store.getters['auth/check']) {
    next({
      name: 'home'
    })
  } else {
    if (!store.getters['app/initialized']) {
      try {
        await store.dispatch('NFT/getNFTs')
        await store.dispatch('auth/getUserNFTTokenIds')
      } catch (error) {
        //
      }
    }

    next()
  }
}
