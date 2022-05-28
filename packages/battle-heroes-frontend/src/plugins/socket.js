import io from 'socket.io-client'
import { BACKEND_URL, SOCKET_TIMEOUT } from '@/utils/constants'

const socket = io(BACKEND_URL, {
  path: '/socket',
  transports: ['websocket'],
  timeout: SOCKET_TIMEOUT,
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
