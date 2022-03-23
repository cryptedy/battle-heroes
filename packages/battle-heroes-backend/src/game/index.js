const { createBattle } = require('../battle')
const { createPlayer } = require('../player')
const { createMessage } = require('../message')
const { addMessage } = require('../message/actions')
const { PLAYER_STATE } = require('../utils/constants')
const { selectMessages } = require('../message/selectors')
const { addBattle, removeBattle } = require('../battle/actions')
const {
  addPlayer,
  updatePlayerState,
  addPlayerSocket,
  removePlayerSocket
} = require('../player/actions')
const {
  selectPlayer,
  selectPlayers,
  selectUserPlayer,
  selectSocketPlayer
} = require('../player/selectors')
const { selectBattles, selectPlayerBattle } = require('../battle/selectors')

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
      // TODO: update player tokenIds

      addPlayerSocket({ player, socket })

      socket.broadcast.emit('player:update', selectPlayer(player.id))
    } else {
      const newPlayer = await createPlayer(user)

      addPlayer(newPlayer)
      addPlayerSocket({ player: newPlayer, socket })

      socket.broadcast.emit('player:player', selectPlayer(newPlayer.id))
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
      removePlayerSocket({ player, socket })

      io.emit('player:update', selectPlayer(player.id))

      callback({ status: true })
    } else {
      callback({ status: false })
    }
  }

  const onCreateBattle = NFT => {
    console.log('onCreateBattle', socket.id, NFT)

    const player = selectSocketPlayer(socket.id)

    if (player) {
      const battles = selectBattles()

      if (
        battles.some(
          battle =>
            battle.player.id === player.id ||
            battle.opponent_player.id === player.id
        )
      ) {
        return console.log('Player already join the a battle')
      }

      const battle = createBattle(player, NFT)

      addBattle(battle)

      updatePlayerState({ player, state: PLAYER_STATE.STANDBY })

      io.emit('player:update', selectPlayer(player.id))
      io.emit('battle:battle', battle)
    }
  }

  const onDeleteBattle = () => {
    console.log('onDeleteBattle', socket.id)

    const player = selectSocketPlayer(socket.id)

    if (player) {
      const playerBattle = selectPlayerBattle(player)

      if (playerBattle) {
        removeBattle(playerBattle)

        updatePlayerState({ player, state: PLAYER_STATE.IDLE })

        io.emit('player:update', selectPlayer(player.id))

        // TODO: emit a delete battle ID
        io.emit('battle:battles', selectBattles())
      }
    }
  }

  const onRandomBattle = () => {
    console.log('onRandomBattle', socket.id)
  }

  const onNewMessage = text => {
    console.log('onNewMessage', socket.id)

    const player = selectSocketPlayer(socket.id)

    if (player) {
      const message = createMessage(text, player)

      addMessage(message)

      io.emit('message:message', message)
    }
  }

  const onDisconnect = () => {
    console.log('onDisconnect', socket.id)

    const player = selectSocketPlayer(socket.id)

    if (player) {
      removePlayerSocket({ player, socket })

      io.emit('player:update', selectPlayer(player.id))
    }
  }

  socket.on('game:login', onLogin)
  socket.on('game:logout', onLogout)

  socket.on('battle:create', onCreateBattle)
  socket.on('battle:random', onRandomBattle)
  socket.on('battle:delete', onDeleteBattle)

  socket.on('message:new', onNewMessage)

  socket.on('disconnect', onDisconnect)
}

module.exports = {
  gameManager
}
