import store from '@/store'

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

      console.log('The network connection has been lost.')
    })
  }
}
