const { v4: uuidv4 } = require('uuid')
const { findUser } = require('../user')
const { createBattle } = require('../battle')
const { createMessage } = require('../message')
const { selectNFT } = require('../NFT/selectors')
const { selectMessages, selectMessage } = require('../message/selectors')
const { selectGame, selectBattleGame } = require('./selectors')
const { addPlayer, updatePlayer } = require('../player/actions')
const { createPlayer, updatePlayerStats } = require('../player')
const { addMessage, removeMessage } = require('../message/actions')
const {
  addGame,
  removeGame,
  updateGame,
  updateGamePlayer
} = require('./actions')
const {
  addBattle,
  removeBattle,
  updateBattle,
  joinBattle
} = require('../battle/actions')
const {
  PLAYER_STATE,
  PLAYER_MOVE,
  BATTLE_STATE
} = require('../utils/constants')
const {
  selectBattles,
  selectBattle,
  selectPlayerBattle
} = require('../battle/selectors')
const {
  selectPlayer,
  selectPlayers,
  selectUserPlayer
} = require('../player/selectors')

const getRandomArbitrary = (min, max) => {
  return Math.floor(Math.random() * (max - min) + min)
}

const createStatus = () => {
  const maxHp = getRandomArbitrary(90, 110)
  const attack = getRandomArbitrary(15, 25)
  const defense = getRandomArbitrary(15, 25)
  const speed = getRandomArbitrary(15, 25)

  return {
    max_hp: maxHp,
    hp: maxHp,
    attack: attack,
    defense: defense,
    speed: speed
  }
}

const createGame = battleId => {
  const message = 'START BATTLE!'

  const status1 = createStatus()
  const status2 = createStatus()

  let currentPlayer = 1

  if (status1.speed === status2.speed) {
    currentPlayer = Math.floor(Math.random() * 2) + 1
  } else if (status1.speed > status2.speed) {
    currentPlayer = 1
  } else {
    currentPlayer = 2
  }

  return {
    id: uuidv4(),
    battle_id: battleId,
    turn: 1,
    current_player: currentPlayer,
    players: {
      1: { ...status1 },
      2: { ...status2 }
    },
    messages: [message]
  }
}

const gameManager = (io, socket) => {
  const errorHandler = error => {
    const { message, stack } = error

    socket.emit('error', { message, stack })
  }

  const getRooms = () => io.of('/').adapter.rooms

  const getPlayerRooms = () => {
    const rooms = getRooms()
    const players = selectPlayers()

    return new Map(
      // eslint-disable-next-line no-unused-vars
      [...rooms].filter(([roomId, socketIds]) =>
        players.some(player => player.id === roomId)
      )
    )
  }

  const joinPlayerRoom = playerId => {
    socket.join(playerId)

    updatePlayer({
      playerId: playerId,
      payload: { socket_ids: getPlayerSocketIds(playerId) }
    })
  }

  const leavePlayerRoom = playerId => {
    socket.leave(playerId)

    updatePlayer({
      playerId: playerId,
      payload: { socket_ids: getPlayerSocketIds(playerId) }
    })
  }

  const findSocketPlayerId = socketId => {
    const playerRooms = getPlayerRooms()

    for (const [roomId, socketIds] of playerRooms.entries()) {
      if (socketIds.has(socketId)) return roomId
    }
  }

  const findSocketPlayer = socketId => {
    const playerId = findSocketPlayerId(socketId)

    if (playerId) {
      return selectPlayer(playerId)
    }
  }

  const findPlayerRoom = playerId => io.sockets.adapter.rooms.get(playerId)

  const getPlayerSocketIds = playerId => {
    const playerRoom = findPlayerRoom(playerId)

    return playerRoom ? Array.from(playerRoom.values()) : []
  }

  const getBattlePlayerKey = (battle, playerId) => {
    const playerKey = Object.keys(battle.players).find(
      playerKey => battle.players[playerKey].id === playerId
    )

    return Number.parseInt(playerKey)
  }

  const getBattleOpponentPlayer = (battle, playerId) => {
    const playerKey = getBattlePlayerKey(battle, playerId)

    if (playerKey) {
      const opponentPlayerKey = playerKey === 1 ? 2 : 1
      const opponentPlayerId = battle.players[opponentPlayerKey].id

      return selectPlayer(opponentPlayerId)
    }
  }

  const onLogin = async (user, callback) => {
    console.log('onLogin', socket.id, user)

    const player = selectUserPlayer(user.id)

    if (player) {
      // TODO: update player tokenIds

      joinPlayerRoom(player.id)

      socket.broadcast.emit('player:update', selectPlayer(player.id))
    } else {
      try {
        const newUser = await findUser(user.id)
        const newPlayer = await createPlayer(newUser)

        addPlayer(newPlayer)
        joinPlayerRoom(newPlayer.id)

        socket.broadcast.emit('player:player', selectPlayer(newPlayer.id))
      } catch (error) {
        errorHandler(error)
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
  }

  const onLogout = callback => {
    console.log('onLogout', socket.id)

    const player = findSocketPlayer(socket.id)

    if (player) {
      leavePlayerRoom(player.id)

      io.emit('player:update', selectPlayer(player.id))

      callback({ status: true })
    } else {
      callback({ status: false })
    }
  }

  const onCreateBattle = (NFTId, callback) => {
    console.log('onCreateBattle', socket.id, NFTId)

    const player = findSocketPlayer(socket.id)

    if (player) {
      if (selectPlayerBattle(player.id)) {
        return callback({ status: false })
      }

      const battle = createBattle(player.id, NFTId)

      addBattle(battle)

      updatePlayer({
        playerId: player.id,
        payload: { state: PLAYER_STATE.STANDBY }
      })

      io.emit('player:update', selectPlayer(player.id))
      io.emit('battle:battle', selectBattle(battle.id))

      callback({ status: true })
    } else {
      callback({ status: false })
    }
  }

  const onDeleteBattle = (battleId, callback) => {
    console.log('onDeleteBattle', socket.id, battleId)

    const battle = selectBattle(battleId)

    if (battle) {
      const game = selectBattleGame(battleId)

      if (game) {
        removeGame(game.id)
      }

      const player = findSocketPlayer(socket.id)

      console.log('player', player)

      if (player) {
        updatePlayer({
          playerId: player.id,
          payload: { state: PLAYER_STATE.IDLE }
        })

        io.emit('player:update', selectPlayer(player.id))

        const opponentPlayer = getBattleOpponentPlayer(battle, player.id)
        console.log('opponentPlayer', opponentPlayer)

        if (opponentPlayer) {
          updatePlayer({
            playerId: opponentPlayer.id,
            payload: { state: PLAYER_STATE.IDLE }
          })

          io.emit('player:update', selectPlayer(opponentPlayer.id))
        }
      } else {
        //
      }

      removeBattle(battleId)

      io.emit('battle:delete', battleId)

      callback({ status: true })
    } else {
      callback({ status: false })
    }
  }

  const onJoinBattle = (battleId, NFTId) => {
    console.log('onJoinBattle', socket.id, battleId, NFTId)

    const player = findSocketPlayer(socket.id)

    if (player) {
      const battle = selectBattle(battleId)

      if (battle) {
        if (battle.state !== BATTLE_STATE.CREATED) {
          throw new Error('Can not join the battle.')
        }

        joinBattle({ battleId: battle.id, playerId: player.id, NFTId })

        const opponentPlayer = getBattleOpponentPlayer(
          selectBattle(battle.id),
          player.id
        )

        updatePlayer({
          playerId: player.id,
          payload: { state: PLAYER_STATE.BATTLE }
        })

        updatePlayer({
          playerId: opponentPlayer.id,
          payload: { state: PLAYER_STATE.BATTLE }
        })

        updateBattle({
          battleId: battle.id,
          payload: { state: BATTLE_STATE.READY }
        })

        io.emit('battle:update', selectBattle(battle.id))
        io.emit('player:update', selectPlayer(player.id))
        io.emit('player:update', selectPlayer(opponentPlayer.id))

        io.to(player.id).emit('battle:matched', battle.id)
        io.to(opponentPlayer.id).emit('battle:matched', battle.id)
      } else {
        //
      }
    } else {
      //
    }
  }

  const onLeaveBattle = battleId => {
    console.log('onLeaveBattle', battleId, socket.id)
  }

  const onRandomBattle = () => {
    console.log('onRandomBattle', socket.id)
  }

  const onStartGame = (battleId, callback) => {
    console.log('onStartGame', socket.id, battleId)

    const battle = selectBattle(battleId)

    if (battle) {
      if (battle.state === BATTLE_STATE.ENDED) {
        return callback({ status: false })
      }

      const game = selectBattleGame(battle.id)

      if (game) {
        callback({
          status: true,
          game
        })
      } else {
        const newGame = createGame(battle.id)

        addGame(newGame)

        updateBattle({
          battleId: battle.id,
          payload: { state: BATTLE_STATE.STARTED }
        })

        callback({
          status: true,
          game: newGame
        })
      }
    } else {
      callback({
        status: false
      })
    }
  }

  const onFinishGame = gameId => {
    console.log('onFinishGame', socket.id, gameId)

    const game = selectGame(gameId)

    if (game) {
      removeGame(gameId)
    }
  }

  const onPlayerMove = async move => {
    console.log('onPlayerMove', socket.id, move)

    const localMessages = []

    const player = findSocketPlayer(socket.id)

    if (player) {
      const battle = selectPlayerBattle(player.id)

      if (battle) {
        const game = selectBattleGame(battle.id)

        if (game) {
          const playerKey = getBattlePlayerKey(battle, player.id)
          const playerNFT = selectNFT(battle.players[playerKey].NFT_id)

          const opponentPlayer = getBattleOpponentPlayer(
            selectBattle(battle.id),
            player.id
          )

          if (opponentPlayer) {
            const opponentKey = getBattlePlayerKey(battle, opponentPlayer.id)
            const opponentNFT = selectNFT(battle.players[opponentKey].NFT_id)

            if (move === PLAYER_MOVE.ATTACK) {
              localMessages.push(`${player.name}'s ${playerNFT.name} attacks!`)

              const rand = Math.floor(Math.random() * 100)

              if (rand <= 10) {
                localMessages.push('Miss!')
              } else {
                let damage = Math.floor(
                  (game.players[playerKey].attack * 100) /
                    (100 + game.players[opponentKey].defense)
                )

                if (rand >= 95) {
                  damage = Math.floor(damage * 1.5)

                  localMessages.push('Critical hit!!')
                }

                let hp = game.players[opponentKey].hp - damage

                localMessages.push(
                  `${opponentPlayer.name}'s ${opponentNFT.name} takes damage ${damage}`
                )

                if (hp < 0) {
                  hp = 0

                  localMessages.push(
                    `${opponentPlayer.name}'s ${opponentNFT.name} fainted...`
                  )

                  updatePlayer({
                    playerId: player.id,
                    payload: { state: PLAYER_STATE.IDLE }
                  })

                  updatePlayer({
                    playerId: opponentPlayer.id,
                    payload: { state: PLAYER_STATE.IDLE }
                  })

                  updatePlayerStats(player.id, {
                    exp: player.exp + 3,
                    win: player.win + 1
                  }).then(() => {
                    io.emit('player:update', selectPlayer(player.id))
                  })

                  updatePlayerStats(opponentPlayer.id, {
                    exp: opponentPlayer.exp + 1,
                    lose: opponentPlayer.lose + 1
                  }).then(() => {
                    io.emit('player:update', selectPlayer(opponentPlayer.id))
                  })

                  updateBattle({
                    battleId: battle.id,
                    payload: { state: BATTLE_STATE.ENDED }
                  })

                  io.emit('player:update', selectPlayer(player.id))
                  io.emit('player:update', selectPlayer(opponentPlayer.id))
                  io.emit('battle:update', selectBattle(battle.id))
                }

                updateGamePlayer({
                  gameId: game.id,
                  playerKey: opponentKey,
                  payload: {
                    hp: hp
                  }
                })
              }
            }
          }

          const currentPlayer = game.current_player === 1 ? 2 : 1
          const turn = game.turn + 1
          const messages = game.messages.concat(localMessages)

          updateGame({
            gameId: game.id,
            payload: {
              current_player: currentPlayer,
              turn,
              messages
            }
          })

          io.to(player.id).emit('game:update', selectGame(game.id))

          if (opponentPlayer) {
            io.to(opponentPlayer.id).emit('game:update', selectGame(game.id))
          }
        }
      }
    }
  }

  const onCreateMessage = text => {
    console.log('onCreateMessage', socket.id, text)

    const player = findSocketPlayer(socket.id)

    if (player) {
      const message = createMessage(text, player)

      addMessage(message)

      io.emit('message:message', message)
    }
  }

  const onDeleteMessage = messageId => {
    console.log('onDeleteMessage', socket.id, messageId)

    const message = selectMessage(messageId)

    if (message) {
      removeMessage(message.id)

      io.emit('message:delete', message.id)
    }
  }

  const onDisconnecting = () => {
    console.log('onDisconnecting', socket.id)

    const player = findSocketPlayer(socket.id)

    if (player) {
      leavePlayerRoom(player.id)

      io.emit('player:update', selectPlayer(player.id))
    }
  }

  const onDisconnect = () => {
    console.log('onDisconnect', socket.id)
  }

  io.of('/').adapter.on('create-room', room => {
    console.log('create-room', room)
  })

  io.of('/').adapter.on('join-room', (room, socketId) => {
    console.log('join-room', room, socketId)
  })

  socket.on('game:login', onLogin)
  socket.on('game:logout', onLogout)
  socket.on('game:start', onStartGame)
  socket.on('game:finish', onFinishGame)
  socket.on('battle:create', onCreateBattle)
  socket.on('battle:delete', onDeleteBattle)
  socket.on('battle:join', onJoinBattle)
  socket.on('battle:leave', onLeaveBattle)
  socket.on('battle:random', onRandomBattle)
  socket.on('player:move', onPlayerMove)
  socket.on('message:create', onCreateMessage)
  socket.on('message:delete', onDeleteMessage)
  socket.on('disconnecting', onDisconnecting)
  socket.on('disconnect', onDisconnect)
}

module.exports = {
  gameManager
}
