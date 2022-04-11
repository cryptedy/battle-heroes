import store from '@/store'
import io from 'socket.io-client'
import { BACKEND_URL } from '@/utils/constants'

const socket = io(BACKEND_URL, {
  transports: ['websocket'],
  autoConnect: false,
  reconnection: false
})

let relogin = false

const tryReconnect = () => {
  console.log('tryReconnect called')

  store.dispatch('socket/onReconnecting')

  if (store.getters['game/isLogin']) {
    relogin = true
    store.dispatch('game/logout')
  }

  setTimeout(() => {
    socket.io.open(error => {
      console.log('tryReconnectError', error)

      if (error) {
        console.log('tryReconnect called')
        tryReconnect()
      } else {
        console.log('tryReconnect succeed')

        store.dispatch('socket/onReconnect')

        if (relogin) {
          store.dispatch('game/login')
          relogin = false
        }
      }
    })
  }, 2000)
}

socket.io.on('close', tryReconnect)

socket.on('test', battleId => {
  console.log('test', battleId)
})

export default {
  // eslint-disable-next-line no-unused-vars
  install(app, options) {
    app.config.globalProperties.$socket = socket
  }
}

export { socket }
