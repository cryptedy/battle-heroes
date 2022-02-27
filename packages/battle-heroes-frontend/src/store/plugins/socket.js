export default function createWebSocketPlugin(socket) {
  return store => {
    // socket events
    socket.on('connect', () => store.dispatch('socket/onConnect'))
    socket.on('disconnect', () => store.dispatch('socket/onDisconnect'))
    socket.on('connect_error', error =>
      store.dispatch('socket/onConnectError', { error })
    )

    // manager events
    socket.io.on('error', error => store.dispatch('socket/onError', { error }))
    socket.io.on('reconnect', attempt =>
      store.dispatch('socket/onReconnect', { attempt })
    )
    socket.io.on('reconnect_attempt', attempt =>
      store.dispatch('socket/onReconnectAttempt', { attempt })
    )
    socket.io.on('reconnect_error', error =>
      store.dispatch('socket/onReconnectError', { error })
    )
    socket.io.on('reconnect_failed', () =>
      store.dispatch('socket/onReconnectFailed')
    )

    // chat event
    // TODO: separate file
    socket.on('chat:users', users => store.dispatch('chat/setUsers', { users }))
    socket.on('chat:message', ({ user, text }) =>
      store.dispatch('chat/setMessage', { user, text })
    )
  }
}
