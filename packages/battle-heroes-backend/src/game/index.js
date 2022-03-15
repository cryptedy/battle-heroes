const chatActions = require('../chat/actions')
const chatSelectors = require('../chat/selectors')
const playerActions = require('../player/actions')
const playerSelectors = require('../player/selectors')
const { createPlayer } = require('../player')
const { PLAYER_STATE } = require('../utils/constants')

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
    console.log('onLogin')

    await waitProcess(PROCESS_LOGIN)

    PROCESS.LOGIN = true

    const player = playerSelectors.findByUser(user)

    if (player) {
      playerActions.addSocket({ player, socket })
    } else {
      const newPlayer = await createPlayer(user, socket)

      playerActions.add(newPlayer)
    }

    const players = playerSelectors.all()
    const messages = chatSelectors.allMessages()

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

    const player = playerSelectors.findBySocket(socket)

    playerActions.updateState({ player, state: PLAYER_STATE.STANDBY })

    const players = playerSelectors.all()

    io.emit('player:players', players)
  }

  const onPlayerIdle = () => {
    console.log('onPlayerIdle', socket.id)

    const player = playerSelectors.findBySocket(socket)

    playerActions.updateState({ player, state: PLAYER_STATE.IDLE })

    const players = playerSelectors.all()

    io.emit('player:players', players)
  }

  const onNewMessage = text => {
    console.log('onNewMessage', socket.id)

    const player = playerSelectors.findBySocket(socket)

    chatActions.addMessage({ text, player })

    const messages = chatSelectors.allMessages()

    io.emit('chat:messages', messages)
  }

  const onLogout = callback => {
    console.log('onLogout', socket.id)

    const player = playerSelectors.findBySocket(socket)

    if (player) {
      playerActions.removeSocket(socket)

      const players = playerSelectors.all()

      io.emit('player:players', players)

      callback({ status: true })
    } else {
      callback({ status: false })
    }
  }

  const onDisconnect = () => {
    console.log('onDisconnect', socket.id)

    const player = playerSelectors.findBySocket(socket)

    if (player) {
      playerActions.removeSocket(socket)

      const players = playerSelectors.all()

      io.emit('player:players', players)
    }
  }

  socket.on('game:login', onLogin)
  socket.on('game:logout', onLogout)
  socket.on('player:standBy', onPlayerStandBy)
  socket.on('player:idle', onPlayerIdle)
  socket.on('chat:newMessage', onNewMessage)
  socket.on('disconnect', onDisconnect)
}

module.exports = {
  gameManager
}
