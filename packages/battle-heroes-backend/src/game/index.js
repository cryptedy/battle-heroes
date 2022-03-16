const { createPlayer } = require('../player')
const { createMessage } = require('../message')
const { addMessage } = require('../message/actions')
const { PLAYER_STATE } = require('../utils/constants')
const { selectMessages } = require('../message/selectors')
const {
  addPlayer,
  updatePlayerState,
  addPlayerSocket,
  removePlayerSocket
} = require('../player/actions')
const {
  selectPlayers,
  selectPlayerByUser,
  selectPlayerBySocket
} = require('../player/selectors')

const PROCESS_LOGIN = 'PROCESS_LOGIN'

const PROCESS = {
  [PROCESS_LOGIN]: false
}

const waitProcess = name => {
  return new Promise(resolve => {
    let interval = setInterval(() => {
      if (!PROCESS[name]) {
        clearInterval(interval)
        resolve(true)
      }
    }, 5000)
  })
}

const gameManager = (io, socket) => {
  const onLogin = async (user, callback) => {
    console.log('onLogin', socket.id, user.name)

    await waitProcess(PROCESS_LOGIN)

    PROCESS.LOGIN = true

    const player = selectPlayerByUser(user)

    if (player) {
      addPlayerSocket({ player, socket })
    } else {
      const newPlayer = await createPlayer(user, socket)

      addPlayer(newPlayer)
    }

    const players = selectPlayers()
    const messages = selectMessages()

    // to login user
    callback({
      status: true,
      players,
      messages
    })

    // to other users
    socket.broadcast.emit('player:players', players)

    PROCESS.LOGIN = false
  }

  const onPlayerStandBy = () => {
    console.log('onPlayerStandBy', socket.id)

    const player = selectPlayerBySocket(socket)

    updatePlayerState({ player, state: PLAYER_STATE.STANDBY })

    const players = selectPlayers()

    io.emit('player:players', players)
  }

  const onPlayerIdle = () => {
    console.log('onPlayerIdle', socket.id)

    const player = selectPlayerBySocket(socket)

    updatePlayerState({ player, state: PLAYER_STATE.IDLE })

    const players = selectPlayers()

    io.emit('player:players', players)
  }

  const onNewMessage = text => {
    console.log('onNewMessage', socket.id)

    const player = selectPlayerBySocket(socket)

    const message = createMessage(text, player)

    addMessage(message)

    const messages = selectMessages()

    io.emit('message:messages', messages)
  }

  const onLogout = callback => {
    console.log('onLogout', socket.id)

    const player = selectPlayerBySocket(socket)

    if (player) {
      removePlayerSocket(socket)

      const players = selectPlayers()

      io.emit('player:players', players)

      callback({ status: true })
    } else {
      callback({ status: false })
    }
  }

  const onDisconnect = () => {
    console.log('onDisconnect', socket.id)

    const player = selectPlayerBySocket(socket)

    if (player) {
      removePlayerSocket(socket)

      const players = selectPlayers()

      io.emit('player:players', players)
    }
  }

  socket.on('game:login', onLogin)
  socket.on('game:logout', onLogout)
  socket.on('player:standBy', onPlayerStandBy)
  socket.on('player:idle', onPlayerIdle)
  socket.on('message:new', onNewMessage)
  socket.on('disconnect', onDisconnect)
}

module.exports = {
  gameManager
}
