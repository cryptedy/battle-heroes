import io from 'socket.io-client'
import { BACKEND_URL } from '@/utils/constants'

const socket = io(BACKEND_URL, {
  transports: ['websocket'],
  timeout: 20000,
  autoConnect: false,
  reconnection: false
})

export default {
  // eslint-disable-next-line no-unused-vars
  install(app, options) {
    app.config.globalProperties.$socket = socket
  }
}

export { socket }
