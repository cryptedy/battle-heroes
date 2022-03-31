import store from '@/store'
// import { socket } from './socket'

export default {
  // eslint-disable-next-line no-unused-vars
  install(app, options) {
    // eslint-disable-next-line no-unused-vars
    window.addEventListener('online', event => {
      store.dispatch('network/onOnline')

      console.log('You are now connected to the network.')
    })

    // eslint-disable-next-line no-unused-vars
    window.addEventListener('offline', event => {
      store.dispatch('network/onOffline')

      // TEST 1
      if (store.getters['game/isLogin']) {
        store.dispatch('game/logout')
      }

      // TEST 2
      // socket.disconnect()

      console.log('The network connection has been lost.')
    })
  }
}
