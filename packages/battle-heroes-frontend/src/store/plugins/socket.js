export default function createWebSocketPlugin(socket) {
  return store => {
    socket.on('connect', () => store.dispatch('socket/onConnect'))
    socket.on('disconnect', () => store.dispatch('socket/onDisconnect'))
    socket.on('connect_error', error =>
      store.dispatch('socket/onConnectError', error)
    )
    socket.io.on('error', error => store.dispatch('socket/onError', error))
  }
}
