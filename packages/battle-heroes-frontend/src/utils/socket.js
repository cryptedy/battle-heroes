import io from 'socket.io-client'
import { BACKEND_URL } from '@/utils/constants'

const socket = io(BACKEND_URL, {
  // disables the HTTP long-polling transport
  transports: ['websocket'],
  autoConnect: false
})

export default socket
