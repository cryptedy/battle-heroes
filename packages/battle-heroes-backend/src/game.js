const moment = require('moment')
const store = require('./store')
const { PLAYER_STATE } = require('./constants')

module.exports = (io, socket) => {
  const createPlayer = (user, tokenIds) => {
    return {
      ...user,
      socket_id: socket.id,
      token_ids: tokenIds,
      state: PLAYER_STATE.IDLE
    }
  }

  const findPlayer = socketId => {
    const { players } = store.getState()

    return players.find(player => player.socket_id === socketId)
  }

  const createMessage = text => {
    return {
      player: findPlayer(socket.id),
      text,
      posted_at: moment().unix()
    }
  }

  const onJoin = ({ user, tokenIds }) => {
    const player = createPlayer(user, tokenIds)

    store.dispatch({
      type: 'SET_PLAYER',
      payload: { ...player }
    })

    const { players, messages } = store.getState()

    io.emit('game:players', players)
    io.emit('chat:messages', messages)
  }

  const onNewMessage = text => {
    const message = createMessage(text)

    store.dispatch({
      type: 'SET_MESSAGE',
      payload: { ...message }
    })

    io.emit('chat:message', message)
  }

  const onDisconnect = () => {
    store.dispatch({
      type: 'DELETE_PLAYER',
      payload: { socket_id: socket.id }
    })

    const { players } = store.getState()

    io.emit('game:players', players)
  }

  socket.on('game:join', onJoin)
  socket.on('chat:newMessage', onNewMessage)
  socket.on('disconnect', onDisconnect)
}
