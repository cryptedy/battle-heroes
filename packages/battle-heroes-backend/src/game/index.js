const { createPlayer } = require('../player')
const { addGame } = require('../game/actions')
const { createMessage } = require('../message')
const { addMessage } = require('../message/actions')
const { PLAYER_STATE } = require('../utils/constants')
const { selectMessages } = require('../message/selectors')
const { nanoid } = require('@reduxjs/toolkit')
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

const createGame = (player, opponentPlayer) => {
  return {
    id: nanoid(),
    player_ids: [player.id, opponentPlayer.id]
  }
}

const gameManager = (io, socket) => {
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

  const onLogin = async (user, callback) => {
    console.log('onLogin', socket.id, user)

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

    if (player) {
      const players = selectPlayers()

      const opponentPlayer = players.find(
        otherPlayer => otherPlayer.state === PLAYER_STATE.STANDBY
      )

      if (opponentPlayer) {
        const mewGame = createGame(player, opponentPlayer)

        addGame(mewGame)

        updatePlayerState({ player, state: PLAYER_STATE.BATTLE })
        updatePlayerState({
          player: opponentPlayer,
          state: PLAYER_STATE.BATTLE
        })

        // to player
        player.socket_ids.forEach(socketId =>
          io.to(socketId).emit('game:matched', mewGame)
        )

        // to opponent player
        opponentPlayer.socket_ids.forEach(socketId =>
          io.to(socketId).emit('game:matched', mewGame)
        )
      } else {
        updatePlayerState({ player, state: PLAYER_STATE.STANDBY })
      }

      io.emit('player:players', selectPlayers())
    }
  }

  const onPlayerIdle = () => {
    console.log('onPlayerIdle', socket.id)

    const player = selectPlayerBySocket(socket)

    if (player) {
      updatePlayerState({ player, state: PLAYER_STATE.IDLE })

      io.emit('player:players', selectPlayers())
    }
  }

  const onNewMessage = text => {
    console.log('onNewMessage', socket.id)

    const player = selectPlayerBySocket(socket)

    if (player) {
      const message = createMessage(text, player)

      addMessage(message)

      io.emit('message:messages', selectMessages())
    }
  }

  const onLogout = callback => {
    console.log('onLogout', socket.id)

    const player = selectPlayerBySocket(socket)

    if (player) {
      removePlayerSocket(socket)

      io.emit('player:players', selectPlayers())

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

      io.emit('player:players', selectPlayers())
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
