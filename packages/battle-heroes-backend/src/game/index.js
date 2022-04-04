const { findUser } = require('../user')
const { createBattle } = require('../battle')
const { createPlayer, updatePlayerStats } = require('../player')
const { createMessage } = require('../message')
const { addMessage, removeMessage } = require('../message/actions')
const { PLAYER_STATE } = require('../utils/constants')
const { selectMessages } = require('../message/selectors')
const { addBattle, removeBattle } = require('../battle/actions')
const {
  addPlayer,
  updatePlayer,
  addPlayerSocket,
  removePlayerSocket
} = require('../player/actions')
const {
  selectPlayer,
  selectPlayers,
  selectUserPlayer,
  selectSocketPlayer
} = require('../player/selectors')
const { selectBattles, selectBattle } = require('../battle/selectors')

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

    const player = selectUserPlayer(user.id)

    if (player) {
      console.log('onLogin => player found')
      // TODO: update player tokenIds

      addPlayerSocket({ playerId: player.id, socketId: socket.id })

      try {
        await updatePlayerStats(player.id, {
          type: 'exp',
          value: player.exp + 1
        })
        console.log('updatePlayerStats DONE!', selectPlayer(player.id))

        socket.broadcast.emit('player:update', selectPlayer(player.id))
      } catch (error) {
        const { message, stack } = error

        socket.emit('error', { message, stack })
      }
    } else {
      console.log('onLogin => player not found, create new player')

      try {
        const newUser = await findUser(user.id)
        const newPlayer = await createPlayer(newUser)

        addPlayer(newPlayer)
        addPlayerSocket({ playerId: newPlayer.id, socketId: socket.id })

        await updatePlayerStats(newPlayer.id, {
          type: 'exp',
          value: newPlayer.exp + 1
        })
        console.log('updatePlayerStats DONE!', selectPlayer(newPlayer.id))

        socket.broadcast.emit('player:player', selectPlayer(newPlayer.id))
      } catch (error) {
        const { message, stack } = error

        socket.emit('error', { message, stack })
      }
    }

    const players = selectPlayers()
    const battles = selectBattles()
    const messages = selectMessages()

    callback({
      status: true,
      players,
      battles,
      messages
    })

    PROCESS.LOGIN = false
  }

  const onLogout = callback => {
    console.log('onLogout', socket.id)

    const player = selectSocketPlayer(socket.id)

    if (player) {
      removePlayerSocket({ playerId: player.id, socketId: socket.id })

      io.emit('player:update', selectPlayer(player.id))

      callback({ status: true })
    } else {
      callback({ status: false })
    }
  }

  const onCreateBattle = async NFTId => {
    console.log('onCreateBattle', socket.id, NFTId)

    const player = selectSocketPlayer(socket.id)

    if (player) {
      // const battles = selectBattles()
      // if (
      //   battles.some(
      //     battle =>
      //       battle.player.id === player.id ||
      //       battle.opponent_player.id === player.id
      //   )
      // ) {
      //   return console.log('Player already joined a battle')
      // }

      const battle = createBattle(player.id, NFTId)

      addBattle(battle)
      updatePlayer({
        playerId: player.id,
        payload: { state: PLAYER_STATE.STANDBY }
      })

      io.emit('player:update', selectPlayer(player.id))
      io.emit('battle:battle', battle)
    }
  }

  const onDeleteBattle = battleId => {
    console.log('onDeleteBattle', socket.id, battleId)

    removeBattle(battleId)
    io.emit('battle:delete', battleId)

    const player = selectSocketPlayer(socket.id)

    if (player) {
      updatePlayer({
        playerId: player.id,
        payload: { state: PLAYER_STATE.IDLE }
      })

      io.emit('player:update', selectPlayer(player.id))
    }
  }

  const onRequestBattle = (battleId, NFTId) => {
    console.log('onStartBattle', socket.id, battleId, NFTId)

    const player = selectSocketPlayer(socket.id)

    if (player) {
      const battle = selectBattle(battleId)

      if (battle) {
        // TODO: join battle

        io.emit('battle:update', selectBattle(battle.id))
      }
    }
  }

  const onRandomBattle = () => {
    console.log('onRandomBattle', socket.id)
  }

  const onCreateMessage = text => {
    console.log('onCreateMessage', socket.id, text)

    const player = selectSocketPlayer(socket.id)

    if (player) {
      const message = createMessage(text, player)

      addMessage(message)

      io.emit('message:message', message)
    }
  }

  const onDeleteMessage = messageId => {
    console.log('onDeleteMessage', socket.id, messageId)

    removeMessage(messageId)

    io.emit('message:delete', messageId)
  }

  const onDisconnect = () => {
    console.log('onDisconnect', socket.id)

    const player = selectSocketPlayer(socket.id)

    if (player) {
      removePlayerSocket({ playerId: player.id, socketId: socket.id })

      io.emit('player:update', selectPlayer(player.id))
    }
  }

  socket.on('game:login', onLogin)
  socket.on('game:logout', onLogout)

  socket.on('battle:create', onCreateBattle)
  socket.on('battle:delete', onDeleteBattle)
  socket.on('battle:request', onRequestBattle)
  socket.on('battle:random', onRandomBattle)

  // socket.on('battle:move', onMoveBattle)

  socket.on('message:create', onCreateMessage)
  socket.on('message:delete', onDeleteMessage)

  socket.on('disconnect', onDisconnect)
}

module.exports = {
  gameManager
}
