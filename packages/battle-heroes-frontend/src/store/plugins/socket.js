export default function createWebSocketPlugin(socket) {
  return store => {
    store.$socket = socket

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

    // game event
    socket.on('game:players', players =>
      store.dispatch('player/setPlayers', { players })
    )

    // chat event
    socket.on('chat:messages', messages =>
      store.dispatch('chat/setMessages', { messages })
    )
    socket.on('chat:message', ({ player, text, posted_at }) =>
      store.dispatch('chat/setMessage', { player, text, posted_at })
    )
  }
}
