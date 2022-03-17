import io from 'socket.io-client'
import { BACKEND_URL } from '@/utils/constants'

const socket = io(BACKEND_URL, {
  transports: ['websocket'],
  autoConnect: false,
  reconnection: false
})

const tryReconnect = () => {
  console.log('tryReconnect called')
  setTimeout(() => {
    socket.io.open(error => {
      console.log('tryReconnectError', error)

      if (error) {
        console.log('call tryReconnect')
        tryReconnect()
      }
    })
  }, 2000)
}

socket.io.on('close', tryReconnect)

export default {
  // eslint-disable-next-line no-unused-vars
  install(app, options) {
    app.config.globalProperties.$socket = socket
  }
}

export { socket }
