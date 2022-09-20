const { v4: uuidv4 } = require('uuid')
const { findUser } = require('../user')
const { createBattle } = require('../battle')
const { createMessage } = require('../message')
const { selectNFT } = require('../NFT/selectors')
const { postDiscord } = require('../utils/discord')
const { selectGame, selectBattleGame } = require('./selectors')
const { addPlayer, updatePlayer } = require('../player/actions')
const { createPlayer, updatePlayerUser } = require('../player')
const { addMessage, removeMessage } = require('../message/actions')
const { selectMessages, selectMessage } = require('../message/selectors')
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
  PLAYER_TYPE,
  PLAYER_STATE,
  PLAYER_MOVE,
  BATTLE_TYPE,
  BATTLE_STATE,
  DISCORD_POST_TYPE
} = require('../utils/constants')
const {
  selectBattles,
  selectBattle,
  selectPlayerBattle
} = require('../battle/selectors')
const {
  selectPlayer,
  selectPlayers,
  selectCPUPlayers,
  selectUserPlayer
} = require('../player/selectors')

const { getMoralisTokenExp, addMoralisTokenExp } = require('../NFT')

//ethersモジュール読み込み
const { ethers } = require('ethers')
const { BigNumber } = require('ethers')

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
    }, 500)
  })
}

const getRandomValue = (min, max) =>
  Math.floor(Math.random() * (max - min) + min)

const getPlayerIdsExcepts = (player1, player2) => {
  return selectPlayers()
    .filter(player => player.id !== player1.id && player.id !== player2.id)
    .map(player => player.id)
}

const createGame = battle => {
  const status = {
    1: createGamePlayerStatus(),
    2: createGamePlayerStatus()
  }

  let currentPlayer = 1

  if (status[1].speed === status[2].speed) {
    currentPlayer = Math.floor(getRandomValue(1, 2))
  } else if (status[1].speed > status[2].speed) {
    currentPlayer = 1
  } else {
    currentPlayer = 2
  }

  const fisrtPlayer = currentPlayer
  const secondPlayer = fisrtPlayer === 1 ? 2 : 1

  const secondPlayerMaxHp = Math.floor(status[secondPlayer].hp * 1.05)
  const secondPlayerAttack = Math.floor(status[secondPlayer].attack * 1.05)
  const secondPlayerDefence = Math.floor(status[secondPlayer].defense * 1.05)
  const secondPlayerIntelligence = Math.floor(status[secondPlayer].int * 1.05)

  status[secondPlayer].max_hp = secondPlayerMaxHp
  status[secondPlayer].hp = secondPlayerMaxHp
  status[secondPlayer].attack = secondPlayerAttack
  status[secondPlayer].defense = secondPlayerDefence
  status[secondPlayer].int = secondPlayerIntelligence

  return {
    id: uuidv4(),
    battle_id: battle.id,
    turn: 1,
    current_player: currentPlayer,
    players: {
      1: { ...battle.players[1], ...status[1] },
      2: { ...battle.players[2], ...status[2] }
    },
    moves: []
  }
}

const createGamePlayerStatus = () => {
  const maxHp = getRandomValue(90, 110)
  const attack = getRandomValue(15, 25)
  const defense = getRandomValue(15, 25)
  const int = getRandomValue(20, 35)
  const speed = getRandomValue(15, 25)

  return {
    is_activated: false,
    max_hp: maxHp,
    hp: maxHp,
    attack: attack,
    defense: defense,
    int: int,
    speed: speed,
    critical_rate: 0.05,
    miss_rate: 0.1,
    is_defence: false,
    must_critical: false,
    attack_remains: 3,
    spell_remains: 1,
    heal_remains: 1
  }
}

class GameManager {
  constructor(io, socket) {
    this.io = io
    this.socket = socket
  }

  listen(callback) {
    try {
      this.addEventListeners()

      return callback()
    } catch (error) {
      this.removeEventListeners()

      return callback(error)
    }
  }

  async login(user, callback) {
    console.log('login', this.socket.id, user)

    if (!user) {
      return callback({
        status: false,
        message: 'Failed to login: The user not found'
      })
    }

    const player = selectUserPlayer(user.id)

    if (player) {
      // TODO: update player tokenIds

      this.joinPlayerRoom(player.id)

      this.socket.broadcast.emit('player:updated', selectPlayer(player.id))
    } else {
      try {
        const newUser = await findUser(user.id)
        const newPlayer = await createPlayer(newUser)

        addPlayer(newPlayer)

        this.joinPlayerRoom(newPlayer.id)

        this.socket.broadcast.emit('player:created', selectPlayer(newPlayer.id))
      } catch (error) {
        return callback({
          status: false,
          message: `Failed to login: ${error.message}`
        })
      }
    }

    const players = selectPlayers()
    const CPUPlayers = selectCPUPlayers()
    const battles = selectBattles()
    const messages = selectMessages()

    return callback({
      status: true,
      message: 'Successfully logged in',
      players: players.concat(CPUPlayers),
      battles,
      messages
    })
  }

  logout(callback) {
    console.log('logout', this.socket.id)

    const player = this.findSocketPlayer(this.socket.id)

    if (player) {
      this.leavePlayerRoom(player.id)

      this.io.emit('player:updated', selectPlayer(player.id))

      return callback({
        status: true,
        message: 'Successfully logged out',
        playerId: player.id
      })
    } else {
      return callback({
        status: false,
        message: 'Failed to logout'
      })
    }
  }

  async renewPlayer(callback) {
    console.log('renewPlayer', this.socket.id)

    const player = this.findSocketPlayer(this.socket.id)

    if (!player) {
      return callback({
        status: false,
        message: 'Failed to renew player: The player not found'
      })
    }

    try {
      const latestUser = await findUser(player.user_id)
      const nerewedPlayer = await createPlayer(latestUser)

      updatePlayer({
        playerId: nerewedPlayer.id,
        payload: { ...nerewedPlayer }
      })

      this.socket.broadcast.emit(
        'player:updated',
        selectPlayer(nerewedPlayer.id)
      )

      return callback({
        status: true,
        message: 'The player renewed',
        player: nerewedPlayer
      })
    } catch (error) {
      return callback({
        status: false,
        message: `Failed to renew player: ${error.message}`
      })
    }
  }

  async updatePlayer(payload, callback) {
    console.log('updatePlayer', this.socket.id, payload)

    const player = this.findSocketPlayer(this.socket.id)

    if (!player) {
      return callback({
        status: false,
        message: 'Failed to update player: The player not found'
      })
    }

    try {
      await updatePlayerUser(player.id, payload)

      const updatedPlayer = selectPlayer(player.id)

      this.socket.broadcast.emit('player:updated', updatedPlayer)

      return callback({
        status: true,
        message: 'The player updated',
        player: updatedPlayer
      })
    } catch (error) {
      return callback({
        status: false,
        message: `Failed to update player: ${error.message}`
      })
    }
  }

  createBattle(NFTId, opponentPlayerId, timeout, callback) {
    console.log(
      'createBattle',
      this.socket.id,
      NFTId,
      opponentPlayerId,
      timeout
    )

    const player = this.findSocketPlayer(this.socket.id)

    if (!player) {
      return callback({
        status: false,
        message: 'Failed to create a battle: The player not found'
      })
    }

    if (!player.nft_ids.includes(NFTId)) {
      return callback({
        status: false,
        message: 'Failed to create a battle: The player must be own the NFT',
        playerId: player.id
      })
    }

    const playerBattle = selectPlayerBattle(player.id)

    if (playerBattle) {
      return callback({
        status: false,
        message:
          'Failed to create a game: The player already has the another battle',
        playerId: player.id
      })
    }

    const battle = createBattle(player.id, NFTId, opponentPlayerId)

    addBattle(battle)

    updatePlayer({
      playerId: player.id,
      payload: { state: PLAYER_STATE.STANDBY }
    })

    const payload = {
      player: selectPlayer(player.id),
      battle: selectBattle(battle.id)
    }

    // send to player
    callback({
      status: true,
      message: 'The battle created',
      ...payload
    })

    // send to the other players
    this.socket.broadcast.emit('player:updated', payload.player)
    this.socket.broadcast.emit('battle:created', payload.battle)

    postDiscord({
      type: DISCORD_POST_TYPE.BATTLE_CREATED,
      payload
    })

    if (opponentPlayerId) {
      // send opponent player
      this.io.to(opponentPlayerId).emit('battle:invited', payload)
    } else {
      // start CPU battle after interval
      let intervalId = setTimeout(() => {
        const currentBattle = selectBattle(battle.id)

        if (currentBattle.state === BATTLE_STATE.CREATED) {
          this.joinBattleAsCPU(battle.id)
        }

        clearTimeout(intervalId)
      }, timeout)
    }
  }

  joinBattle(battleId, NFTId, callback) {
    console.log('joinBattle', this.socket.id, battleId, NFTId)

    const player = this.findSocketPlayer(this.socket.id)

    if (!player) {
      return callback({
        status: false,
        message: 'Failed to join the battle: The player not found'
      })
    }

    if (!player.nft_ids.includes(NFTId)) {
      return callback({
        status: false,
        message: 'Failed to join the battle: The player does not own the NFT'
      })
    }

    const playerBattle = selectPlayerBattle(player.id)

    const playerKey = this.getBattlePlayerKey(playerBattle, player.id)

    if (playerBattle && playerBattle.players[playerKey].NFT_id) {
      return callback({
        status: false,
        message:
          'Failed to join the battle: The player already has the another battle'
      })
    }

    const battle = selectBattle(battleId)

    if (!battle) {
      return callback({
        status: false,
        message: 'Failed to join the battle: Battle not found'
      })
    }

    if (battle.type !== BATTLE_TYPE.HUMAN) {
      return callback({
        status: false,
        message: 'Failed to join the battle: Battle is not for human'
      })
    }

    if (
      battle.state !== BATTLE_STATE.CREATED ||
      battle.state === BATTLE_STATE.RUSHED ||
      battle.state === BATTLE_STATE.ENDED
    ) {
      return callback({
        status: false,
        message: `Failed to join the battle: The battle state is "${battle.state} and type is "${battle.type}"`
      })
    }

    joinBattle({ battleId: battle.id, playerId: player.id, NFTId })

    const opponentPlayer = this.getBattleOpponentPlayer(
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
      payload: {
        type: BATTLE_TYPE.HUMAN,
        state: BATTLE_STATE.READY
      }
    })

    const payload = {
      player1: selectPlayer(player.id),
      player2: selectPlayer(opponentPlayer.id),
      battle: selectBattle(battle.id)
    }

    // send to player
    callback({
      status: true,
      message: 'Join the battle',
      ...payload
    })

    // send to opponent player
    this.io.to(opponentPlayer.id).emit('battle:matched', {
      status: true,
      message: 'Join the battle',
      ...payload
    })

    // send to the other players
    const otherPlayerIds = getPlayerIdsExcepts(player, opponentPlayer)

    otherPlayerIds.forEach(otherPlayerId => {
      this.socket.to(otherPlayerId).emit('player:updated', payload.player1)
      this.socket.to(otherPlayerId).emit('player:updated', payload.player2)
      this.socket.to(otherPlayerId).emit('battle:updated', payload.battle)
    })

    postDiscord({
      type: DISCORD_POST_TYPE.BATTLE_MATCHED,
      payload
    })
  }

  rushBattle(battleId, NFTId, callback) {
    console.log('rushBattle', this.socket.id, battleId, NFTId)

    const player = this.findSocketPlayer(this.socket.id)

    if (!player) {
      return callback({
        status: false,
        message: 'Failed to rush into the battle: The player not found'
      })
    }

    if (!player.nft_ids.includes(NFTId)) {
      return callback({
        status: false,
        message:
          'Failed to rush into the battle: The player does not own the NFT'
      })
    }

    const playerBattle = selectPlayerBattle(player.id)

    if (playerBattle) {
      return callback({
        status: false,
        message:
          'Failed to rush into the battle: The player already has the another battle'
      })
    }

    const battle = selectBattle(battleId)

    if (!battle) {
      return callback({
        status: false,
        message: 'Failed to rush into the battle: Battle not found'
      })
    }

    if (battle.type !== BATTLE_TYPE.CPU) {
      return callback({
        status: false,
        message: 'Failed to rush into the battle: Battle is for CPU'
      })
    }

    if (
      battle.state !== BATTLE_STATE.STARTED ||
      battle.state === BATTLE_STATE.RUSHED ||
      battle.state === BATTLE_STATE.ENDED
    ) {
      return callback({
        status: false,
        message: `Failed to rush into the battle: The battle state is "${battle.state} and type is "${battle.type}"`
      })
    }

    const opponentPlayer = selectPlayer(battle.players[1].id)
    const opponentNFTId = battle.players[1].NFT_id
    const CPUPlayer = selectPlayer(battle.players[2].id)

    // change current battle state
    updateBattle({
      battleId: battle.id,
      payload: {
        state: BATTLE_STATE.RUSHED
      }
    })

    // create a new battle
    const newBattle = createBattle(player.id, NFTId)

    addBattle(newBattle)

    // join a new battle as a opponent player
    joinBattle({
      battleId: newBattle.id,
      playerId: opponentPlayer.id,
      NFTId: opponentNFTId
    })

    updatePlayer({
      playerId: player.id,
      payload: { state: PLAYER_STATE.BATTLE }
    })

    updatePlayer({
      playerId: opponentPlayer.id,
      payload: { state: PLAYER_STATE.BATTLE }
    })

    // update CPU state
    updatePlayer({
      playerId: CPUPlayer.id,
      payload: { state: PLAYER_STATE.IDLE }
    })

    updateBattle({
      battleId: newBattle.id,
      payload: {
        type: BATTLE_TYPE.HUMAN,
        state: BATTLE_STATE.READY
      }
    })

    const game = selectBattleGame(battle.id)

    if (game) {
      removeGame(game.id)
    }

    removeBattle(battle.id)

    const payload = {
      player1: selectPlayer(player.id),
      player2: selectPlayer(opponentPlayer.id),
      battle: selectBattle(newBattle.id)
    }

    // send to player
    callback({
      status: true,
      message: 'Rush into the battle',
      ...payload
    })

    // send to opponent player
    this.io.to(opponentPlayer.id).emit('battle:rushed', {
      status: true,
      message: 'Rush into the battle',
      ...payload
    })

    // send to the other players
    const otherPlayerIds = getPlayerIdsExcepts(player, opponentPlayer)

    otherPlayerIds.forEach(otherPlayerId => {
      this.socket.to(otherPlayerId).emit('player:updated', payload.player1)
      this.socket.to(otherPlayerId).emit('player:updated', payload.player2)
      this.socket.to(otherPlayerId).emit('battle:created', payload.battle)
      this.socket.to(otherPlayerId).emit('battle:deleted', battle.id)
    })

    // send to all players
    this.io.emit('player:updated', selectPlayer(CPUPlayer.id))

    postDiscord({
      type: DISCORD_POST_TYPE.BATTLE_MATCHED,
      payload
    })
  }

  joinBattleAsCPU(battleId) {
    console.log('joinBattleAsCPU', this.socket.id, battleId)

    const player = this.findSocketPlayer(this.socket.id)

    if (!player) {
      throw new Error('Failed to join the battle by CPU: The player not found')
    }

    const battle = selectBattle(battleId)

    if (!battle) {
      throw new Error('Failed to join the battle: Battle not found')
    }

    if (battle.state === BATTLE_STATE.ENDED) {
      throw new Error('Failed to join the battle: The battle already ended')
    }

    if (battle.state === BATTLE_TYPE.CPU) {
      throw new Error(
        'Failed to join the battle: CPU can not join the CPU battle'
      )
    }

    if (battle.state !== BATTLE_STATE.CREATED) {
      throw new Error(
        `Failed to join the battle: The battle state is "${battle.state}" and type is "${battle.type}"`
      )
    }

    const CPUPlayers = selectCPUPlayers().filter(
      CPUPlayer => CPUPlayer.state === PLAYER_STATE.IDLE
    )

    const opponentPlayer =
      CPUPlayers[Math.floor(Math.random() * CPUPlayers.length)]

    const opponentNFTId =
      opponentPlayer.nft_ids[
        Math.floor(Math.random() * opponentPlayer.nft_ids.length)
      ]

    joinBattle({
      battleId: battle.id,
      playerId: opponentPlayer.id,
      NFTId: opponentNFTId
    })

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
      payload: {
        type: BATTLE_TYPE.CPU,
        state: BATTLE_STATE.READY
      }
    })

    const payload = {
      player1: selectPlayer(player.id),
      player2: selectPlayer(opponentPlayer.id),
      battle: selectBattle(battle.id)
    }

    // send to player
    this.io.to(player.id).emit('battle:matched', {
      status: true,
      message: 'Join the battle',
      ...payload
    })

    // send to the other players
    this.socket.broadcast.emit('player:updated', payload.player1)
    this.socket.broadcast.emit('player:updated', payload.player2)
    this.socket.broadcast.emit('battle:updated', payload.battle)

    postDiscord({
      type: DISCORD_POST_TYPE.BATTLE_MATCHED,
      payload
    })
  }

  continueBattle(opponentPlayerId, previousBattleId, nexBattleId) {
    console.log(
      'continueBattle',
      this.socket.id,
      opponentPlayerId,
      previousBattleId,
      nexBattleId
    )

    const player = this.findSocketPlayer(this.socket.id)

    if (!player) {
      throw new Error('Failed to next battle: The player not found')
    }

    this.io.to(opponentPlayerId).emit('battle:next', {
      opponentPlayerId: player.id,
      playerId: opponentPlayerId,
      previousBattleId,
      nexBattleId
    })
  }

  deleteBattle(battleId, callback) {
    console.log('deleteBattle', this.socket.id, battleId)

    const battle = selectBattle(battleId)

    if (!battle) {
      return callback({
        status: false,
        message: 'Failed delete the battle: The battle not found'
      })
    }

    const game = selectBattleGame(battleId)

    if (game) {
      removeGame(game.id)
    }

    const player = this.findSocketPlayer(this.socket.id)

    if (player) {
      if (player.state !== PLAYER_STATE.IDLE) {
        // check if opponent player state has already updated when the battle finished
        updatePlayer({
          playerId: player.id,
          payload: { state: PLAYER_STATE.IDLE }
        })

        this.io.emit('player:updated', selectPlayer(player.id))
      }

      const opponentPlayer = this.getBattleOpponentPlayer(battle, player.id)

      if (opponentPlayer && opponentPlayer.state !== PLAYER_STATE.IDLE) {
        // check if opponent player state has already updated when the battle finished
        updatePlayer({
          playerId: opponentPlayer.id,
          payload: { state: PLAYER_STATE.IDLE }
        })

        this.io.emit('player:updated', selectPlayer(opponentPlayer.id))
      }
    }

    removeBattle(battle.id)

    // send to all players except the player
    this.socket.broadcast.emit('battle:deleted', battle.id)

    return callback({
      status: true,
      message: 'The battle deleted',
      battleId: battle.id
    })
  }

  startGame(battleId, callback) {
    console.log('startGame', this.socket.id, battleId)

    const player = this.findSocketPlayer(this.socket.id)

    if (!player) {
      throw new Error('Failed to start game: The player not found')
    }

    const battle = selectBattle(battleId)

    if (!battle) {
      return callback({
        status: false,
        message: 'Failed to start a game: The battle not found'
      })
    }

    const playerBattle = selectPlayerBattle(player.id)

    if (!playerBattle || playerBattle.id !== battle.id) {
      throw new Error('Failed to start a game: Players can start own battles')
    }

    if (
      battle.state === BATTLE_STATE.RUSHED ||
      battle.state === BATTLE_STATE.ENDED
    ) {
      return callback({
        status: false,
        message:
          'Failed to start a game: The battle is rushed or already ended',
        battleId: battle.id
      })
    }

    const game = selectBattleGame(battle.id)

    const playerKey = this.getBattlePlayerKey(battle, player.id)

    if (game) {
      if (battle.type === BATTLE_TYPE.CPU && !game.players[2].is_activated) {
        updateGamePlayer({
          gameId: game.id,
          playerKey: 2,
          payload: {
            is_activated: true
          }
        })
      } else if (!game.players[playerKey].is_activated) {
        updateGamePlayer({
          gameId: game.id,
          playerKey,
          payload: {
            is_activated: true
          }
        })

        const opponentPlayer = this.getBattleOpponentPlayer(battle, player.id)
        this.io.to(opponentPlayer.id).emit('game:updated', selectGame(game.id))
      }

      return callback({
        status: true,
        message: 'Load the game',
        battleId: battle.id,
        game: selectGame(game.id)
      })
    } else {
      const newGame = createGame(battle)

      addGame(newGame)

      updateBattle({
        battleId: battle.id,
        payload: { state: BATTLE_STATE.STARTED }
      })

      updateGamePlayer({
        gameId: newGame.id,
        playerKey,
        payload: {
          is_activated: true
        }
      })

      if (battle.type === BATTLE_TYPE.CPU) {
        updateGamePlayer({
          gameId: newGame.id,
          playerKey: 2,
          payload: {
            is_activated: true
          }
        })
      }

      this.io.emit('battle:updated', selectBattle(battle.id))

      return callback({
        status: true,
        message: 'Start a new game',
        battleId: battle.id,
        game: selectGame(newGame.id)
      })
    }
  }

  loadGame(battleId, callback) {
    console.log('loadGame', this.socket.id, battleId)

    const battle = selectBattle(battleId)

    if (!battle) {
      return callback({
        status: false,
        message: 'Failed to load a game: The battle not found'
      })
    }

    const game = selectBattleGame(battle.id)

    if (!game) {
      return callback({
        status: false,
        message: 'Failed to load a game: The game not found'
      })
    }

    callback({
      status: true,
      message: 'The game loaded',
      game: game
    })
  }

  finishGame(gameId) {
    console.log('finishGame', this.socket.id, gameId)

    const game = selectGame(gameId)

    if (game) {
      removeGame(gameId)

      const battle = selectBattle(game.battle_id)

      if (battle) {
        removeBattle(battle.id)

        this.io.emit('battle:deleted', battle.id)
      }
    }
  }

  abortGame(gameId, callback) {
    console.log('abortGame', this.socket.id, gameId)

    const game = selectGame(gameId)

    if (game) {
      removeGame(gameId)

      const battle = selectBattle(game.battle_id)

      if (battle) {
        const player = this.findSocketPlayer(this.socket.id)

        if (player) {
          if (player.state !== PLAYER_STATE.IDLE) {
            updatePlayer({
              playerId: player.id,
              payload: { state: PLAYER_STATE.IDLE }
            })

            this.io.emit('player:updated', selectPlayer(player.id))
          }

          const opponentPlayer = this.getBattleOpponentPlayer(battle, player.id)

          if (opponentPlayer) {
            // send to opponent player
            this.io.to(opponentPlayer.id).emit('game:aborted', game.id)

            if (opponentPlayer.state !== PLAYER_STATE.IDLE) {
              updatePlayer({
                playerId: opponentPlayer.id,
                payload: { state: PLAYER_STATE.IDLE }
              })

              this.io.emit('player:updated', selectPlayer(opponentPlayer.id))
            }
          }
        }

        removeBattle(battle.id)

        this.io.emit('battle:deleted', battle.id)
      }

      return callback({
        status: true,
        message: 'The game aborted',
        gameId: game.id
      })
    } else {
      return callback({
        status: false,
        message: 'Failed to abort the game'
      })
    }
  }

  async moveGame(move) {
    console.log('moveGame', this.socket.id, move)

    const player = this.findSocketPlayer(this.socket.id)

    if (!player) {
      throw new Error('Failed to move: The player not found')
    }

    const battle = selectPlayerBattle(player.id)

    if (!battle) {
      throw new Error('Failed to move: The battle not found')
    }

    if (
      battle.state === BATTLE_STATE.RUSHED ||
      battle.state === BATTLE_STATE.ENDED
    ) {
      throw new Error('Failed to move: The battle is rushed or already ended')
    }

    const opponentPlayer = this.getBattleOpponentPlayer(
      selectBattle(battle.id),
      player.id
    )

    if (!opponentPlayer) {
      throw new Error('Failed to move: The opponent player not found')
    }

    const game = selectBattleGame(battle.id)

    if (!game) {
      throw new Error('Failed to move: The game not found')
    }

    const playerKey = this.getBattlePlayerKey(battle, player.id)
    const playerNFT = selectNFT(battle.players[playerKey].NFT_id)
    const playerStatus = game.players[playerKey]

    if (game.current_player !== playerKey) {
      throw new Error('Failed to move: It is not the player turn')
    }

    const opponentPlayerKey = this.getBattlePlayerKey(battle, opponentPlayer.id)
    const opponentNFT = selectNFT(battle.players[opponentPlayerKey].NFT_id)
    const opponentStatus = game.players[opponentPlayerKey]

    const localMove = {
      playerKey: playerKey,
      move: move,
      payload: {}
    }

    const payload = {
      battle,
      game,
      player,
      playerKey,
      playerNFT,
      playerStatus,
      opponentPlayer,
      opponentPlayerKey,
      opponentNFT,
      opponentStatus,
      localMove
    }

    if (move === PLAYER_MOVE.ATTACK) {
      localMove.payload = {
        damage: 0,
        isMiss: false,
        isCritical: false,
        isMustCritical: false,
        isFinish: false,
        isOpponentDefence: opponentStatus.is_defence
      }

      this.attack(payload)
    } else if (move === PLAYER_MOVE.SPELL) {
      localMove.payload = {
        damage: 0,
        isFinish: false,
        isOpponentDefence: opponentStatus.is_defence
      }

      this.spell(payload)
    } else if (move === PLAYER_MOVE.HEAL) {
      localMove.payload = {
        recoveryAmount: 0
      }

      this.heal(payload)
    } else if (move === PLAYER_MOVE.DEFENCE) {
      localMove.payload = {
        recoveryAmount: 0,
        mustCritical: false
      }

      this.defence(payload)
    } else {
      throw new Error('Failed to move: Invalid move type')
    }

    if (localMove.payload.isFinish) {
      updatePlayer({
        playerId: player.id,
        payload: { state: PLAYER_STATE.IDLE }
      })

      updatePlayer({
        playerId: opponentPlayer.id,
        payload: { state: PLAYER_STATE.IDLE }
      })

      updatePlayerUser(player.id, {
        exp: player.exp + 3,
        win: player.win + 1
      })
        .then(() => {
          // update player
          this.io.emit('player:updated', selectPlayer(player.id))
        })
        .catch(error => {
          throw new Error(
            `Failed to update player user: ${error.message}: ${error.stack}`
          )
        })

      // add exp to NFT
      addMoralisTokenExp(playerNFT.collection_id, playerNFT.token_id, 3)
        .then(() => {
          // update tokenExp
          /*this.io.emit(
            'tokenExp:updated',
            playerNFT.collection_id,
            playerNFT.tokenId,
            3
          )*/
          console.log(
            'tokenExp:add',
            playerNFT.collection_id,
            playerNFT.token_id,
            3
          )
        })
        .catch(error => {
          throw new Error(
            `Failed to add exp to NFT: ${error.message}: ${error.stack}`
          )
        })

      if (opponentPlayer.type !== PLAYER_TYPE.CPU) {
        updatePlayerUser(opponentPlayer.id, {
          exp: opponentPlayer.exp + 1,
          lose: opponentPlayer.lose + 1
        })
          .then(() => {
            // update opponent player
            this.io.emit('player:updated', selectPlayer(opponentPlayer.id))
          })
          .catch(error => {
            const { message, stack } = error
            // send to ooponent player
            this.io.to(opponentPlayer.id).emit('game:error', {
              message: `Failed to update player status: ${message}`,
              stack: stack
            })
          })

        // add exp to NFT
        addMoralisTokenExp(opponentNFT.collection_id, opponentNFT.token_id, 1)
          .then(() => {
            // update tokenExp
            /*this.io.emit(
              'tokenExp:updated',
              playerNFT.collection_id,
              playerNFT.tokenId,
              3
            )*/
            console.log(
              'tokenExp:add',
              opponentNFT.collection_id,
              opponentNFT.token_id,
              1
            )
          })
          .catch(error => {
            throw new Error(
              `Failed to add exp to NFT: ${error.message}: ${error.stack}`
            )
          })
      } else {
        // update CPU player
        this.io.emit('player:updated', selectPlayer(opponentPlayer.id))
      }

      updateBattle({
        battleId: battle.id,
        payload: { state: BATTLE_STATE.ENDED }
      })

      this.io.emit('battle:updated', selectBattle(battle.id))

      postDiscord({
        type: DISCORD_POST_TYPE.BATTLE_ENDED,
        payload: {
          winnerPlayer: selectPlayer(player.id),
          loserPlayer: selectPlayer(opponentPlayer.id),
          battle: selectBattle(battle.id),
          game: selectGame(game.id)
        }
      })
    }

    const currentPlayer = game.current_player === 1 ? 2 : 1
    const turn = game.turn + 1
    const moves = game.moves.concat(localMove)

    updateGame({
      gameId: game.id,
      payload: {
        current_player: currentPlayer,
        turn,
        moves
      }
    })

    this.io.emit('game:updated', selectGame(game.id))
  }

  async moveCPUGame() {
    console.log('moveCPUGame', this.socket.id)

    const player = this.findSocketPlayer(this.socket.id)

    if (!player) {
      throw new Error('Failed to CPU move: The player not found')
    }

    const battle = selectPlayerBattle(player.id)

    if (!battle) {
      throw new Error('Failed to CPU move: The battle not found')
    }

    if (battle.type !== BATTLE_TYPE.CPU) {
      // Don't throw an error because CPU battles can be aborted by rush into a player
      // throw new Error(`Failed to CPU move: The battle type is ${battle.type}`)
      return
    }

    if (
      battle.state === BATTLE_STATE.RUSHED ||
      battle.state === BATTLE_STATE.ENDED
    ) {
      throw new Error(
        'Failed to CPU move: The battle is rushed or already ended'
      )
    }

    const opponentPlayer = this.getBattleOpponentPlayer(battle, player.id)

    if (!opponentPlayer) {
      throw new Error('Failed to CPU move: The opponent player not found')
    }

    const game = selectBattleGame(battle.id)

    if (!game) {
      throw new Error('Failed to CPU move: The game not found')
    }

    const playerKey = this.getBattlePlayerKey(battle, player.id)
    const playerNFT = selectNFT(battle.players[playerKey].NFT_id)
    const playerStatus = game.players[playerKey]

    if (game.current_player === playerKey) {
      throw new Error('Failed to CPU move: It is the player turn')
    }

    const opponentPlayerKey = this.getBattlePlayerKey(battle, opponentPlayer.id)
    const opponentNFT = selectNFT(battle.players[opponentPlayerKey].NFT_id)
    const opponentStatus = game.players[opponentPlayerKey]

    let move = PLAYER_MOVE.DEFENCE

    if (
      opponentStatus.hp < 30 &&
      playerStatus.hp > 25 &&
      opponentStatus.heal_remains > 0
    ) {
      move = PLAYER_MOVE.HEAL
    } else if (opponentStatus.spell_remains > 0 && playerStatus.is_defence) {
      move = PLAYER_MOVE.SPELL
    } else if (opponentStatus.attack_remains === 0) {
      move = PLAYER_MOVE.DEFENCE
    } else {
      move = PLAYER_MOVE.ATTACK
    }

    const localMove = {
      playerKey: opponentPlayerKey,
      move: move,
      payload: {}
    }

    const payload = {
      battle,
      game,
      player: opponentPlayer,
      playerKey: opponentPlayerKey,
      playerNFT: opponentNFT,
      playerStatus: opponentStatus,
      opponentPlayer: player,
      opponentPlayerKey: playerKey,
      opponentNFT: playerNFT,
      opponentStatus: playerStatus,
      localMove
    }

    if (move === PLAYER_MOVE.ATTACK) {
      localMove.payload = {
        damage: 0,
        isMiss: false,
        isCritical: false,
        isMustCritical: false,
        isFinish: false,
        isOpponentDefence: playerStatus.is_defence
      }

      this.attack(payload)
    } else if (move === PLAYER_MOVE.SPELL) {
      localMove.payload = {
        damage: 0,
        isFinish: false,
        isOpponentDefence: playerStatus.is_defence
      }

      this.spell(payload)
    } else if (move === PLAYER_MOVE.HEAL) {
      localMove.payload = {
        recoveryAmount: 0
      }

      this.heal(payload)
    } else if (move === PLAYER_MOVE.DEFENCE) {
      localMove.payload = {
        recoveryAmount: 0,
        mustCritical: false
      }

      this.defence(payload)
    } else {
      throw new Error('Failed to CPU move: Invalid move type')
    }

    if (localMove.payload.isFinish) {
      updatePlayer({
        playerId: player.id,
        payload: { state: PLAYER_STATE.IDLE }
      })

      updatePlayer({
        playerId: opponentPlayer.id,
        payload: { state: PLAYER_STATE.IDLE }
      })

      updatePlayerUser(player.id, {
        exp: player.exp + 3,
        win: player.win + 1
      })
        .then(() => {
          // update player
          this.io.emit('player:updated', selectPlayer(player.id))
        })
        .catch(error => {
          throw new Error(
            `Failed to update player user: ${error.message}: ${error.stack}`
          )
        })

      // update CPU player
      this.io.emit('player:updated', selectPlayer(opponentPlayer.id))

      // add exp to NFT
      addMoralisTokenExp(playerNFT.collection_id, playerNFT.token_id, 1)
        .then(() => {
          // update tokenExp
          /*this.io.emit(
                  'tokenExp:updated',
                  playerNFT.collection_id,
                  playerNFT.tokenId,
                  3
                )*/
          console.log(
            'tokenExp:add',
            playerNFT.collection_id,
            playerNFT.token_id,
            1
          )
          console.log(playerNFT)
        })
        .catch(error => {
          throw new Error(
            `Failed to add exp to NFT: ${error.message}: ${error.stack}`
          )
        })

      updateBattle({
        battleId: battle.id,
        payload: { state: BATTLE_STATE.ENDED }
      })

      this.io.emit('battle:updated', selectBattle(battle.id))
    }

    const currentPlayer = game.current_player === 1 ? 2 : 1
    const turn = game.turn + 1
    const moves = game.moves.concat(localMove)

    updateGame({
      gameId: game.id,
      payload: {
        current_player: currentPlayer,
        turn,
        moves
      }
    })

    this.io.emit('game:updated', selectGame(game.id))
  }

  attack(payload) {
    console.log('attack')

    const {
      game,
      playerKey,
      playerStatus,
      opponentPlayerKey,
      opponentStatus,
      localMove
    } = payload

    if (playerStatus.attack_remains <= 0) {
      throw new Error('Failed to CPU move: Can not use attack')
    }

    const nextPlayerStatus = {}
    const nextOpponentStatus = {}

    let damage = 0
    let isMiss = false
    let isCritical = false
    let isMustCritical = false
    let isFinish = false

    if (!playerStatus.must_critical && Math.random() < playerStatus.miss_rate) {
      isMiss = true
    } else {
      damage = Math.floor(
        (playerStatus.attack * 100) / (100 + opponentStatus.defense)
      )

      if (!playerStatus.must_critical && opponentStatus.is_defence) {
        damage = Math.floor(damage * 0.7)
      }

      if (playerStatus.must_critical) {
        isMustCritical = true

        damage = Math.floor(damage * 1.5)
      } else if (Math.random() < playerStatus.critical_rate) {
        isCritical = true

        damage = Math.floor(damage * 1.5)
      } else {
        const adjustDamage = getRandomValue(-2, 2)
        damage = damage + adjustDamage
      }
    }

    const oldOpponentHp = opponentStatus.hp
    const oldOpponentHpRate = oldOpponentHp / opponentStatus.max_hp

    let newOpponentHp = oldOpponentHp - damage
    const newOpponentHpRate = newOpponentHp / opponentStatus.max_hp

    localMove.payload.damage = damage

    if (newOpponentHp < 0) {
      newOpponentHp = 0
    }

    nextOpponentStatus.hp = newOpponentHp

    if (newOpponentHp === 0) {
      isFinish = true
    } else {
      if (oldOpponentHpRate >= 0.25 && newOpponentHpRate < 0.25) {
        nextOpponentStatus.critical_rate = 0.15
      } else if (oldOpponentHpRate >= 0.05 && newOpponentHpRate < 0.05) {
        nextOpponentStatus.critical_rate = 0.25
      }
    }

    localMove.payload.damage = damage
    localMove.payload.isMiss = isMiss
    localMove.payload.isCritical = isCritical
    localMove.payload.isMustCritical = isMustCritical
    localMove.payload.isFinish = isFinish

    nextPlayerStatus.attack_remains = playerStatus.attack_remains - 1

    if (isMustCritical) {
      nextPlayerStatus.must_critical = false
    }

    if (opponentStatus.is_defence) {
      nextOpponentStatus.is_defence = false
    }

    updateGamePlayer({
      gameId: game.id,
      playerKey: playerKey,
      payload: nextPlayerStatus
    })

    updateGamePlayer({
      gameId: game.id,
      playerKey: opponentPlayerKey,
      payload: nextOpponentStatus
    })
  }

  spell(payload) {
    console.log('spell')

    const {
      game,
      playerKey,
      playerStatus,
      opponentPlayerKey,
      opponentStatus,
      localMove
    } = payload

    if (playerStatus.spell_remains <= 0) {
      throw new Error('Failed to CPU move: Can not use spell')
    }

    const nextPlayerStatus = {}
    const nextOpponentStatus = {}

    let damage = 0
    let isFinish = false

    damage = Math.floor(
      (playerStatus.int * 100) / (100 + opponentStatus.defense)
    )

    let nextOpponentHp = opponentStatus.hp - damage

    if (nextOpponentHp < 0) {
      nextOpponentHp = 0
    }

    nextOpponentStatus.hp = nextOpponentHp

    if (nextOpponentHp === 0) {
      isFinish = true
    }

    localMove.payload.damage = damage
    localMove.payload.isFinish = isFinish

    nextPlayerStatus.spell_remains = playerStatus.spell_remains - 1

    if (playerStatus.must_critical) {
      nextPlayerStatus.must_critical = false
    }

    if (opponentStatus.is_defence) {
      nextOpponentStatus.is_defence = false
    }

    updateGamePlayer({
      gameId: game.id,
      playerKey: playerKey,
      payload: nextPlayerStatus
    })

    updateGamePlayer({
      gameId: game.id,
      playerKey: opponentPlayerKey,
      payload: nextOpponentStatus
    })
  }

  defence(payload) {
    console.log('defence')

    const {
      game,
      playerKey,
      playerStatus,
      opponentPlayerKey,
      opponentStatus,
      localMove
    } = payload

    const nextPlayerStatus = {}
    const nextOpponentStatus = {}

    let recoveryAmount = 0
    let mustCritical = false

    const rand = Math.random()

    if (rand < 0.02) {
      recoveryAmount = 4
    } else if (rand < 0.1) {
      recoveryAmount = 2
    } else if (rand < 0.5) {
      recoveryAmount = 1
    } else {
      recoveryAmount = 2
    }

    if (Math.random() < 0.1) {
      mustCritical = true
    }

    localMove.payload.recoveryAmount = recoveryAmount
    localMove.payload.mustCritical = mustCritical

    nextPlayerStatus.attack_remains =
      playerStatus.attack_remains + recoveryAmount
    nextPlayerStatus.must_critical = mustCritical
    nextPlayerStatus.is_defence = true

    if (playerStatus.must_critical) {
      nextPlayerStatus.must_critical = false
    }

    if (opponentStatus.is_defence) {
      nextOpponentStatus.is_defence = false
    }

    updateGamePlayer({
      gameId: game.id,
      playerKey: playerKey,
      payload: nextPlayerStatus
    })

    updateGamePlayer({
      gameId: game.id,
      playerKey: opponentPlayerKey,
      payload: nextOpponentStatus
    })
  }

  heal(payload) {
    console.log('heal')

    const {
      game,
      playerKey,
      playerStatus,
      opponentPlayerKey,
      opponentStatus,
      localMove
    } = payload

    if (playerStatus.heal_remains <= 0) {
      throw new Error('Failed to CPU move: Can not use heal')
    }

    const nextPlayerStatus = {}
    const nextOpponentStatus = {}

    let recoveryAmount = 0

    if (Math.random() < 0.02) {
      recoveryAmount = 100
    } else if (Math.random() < 0.05) {
      recoveryAmount = 0
    } else if (Math.random() < 0.1) {
      recoveryAmount = 50
    } else if (Math.random() < 0.3) {
      recoveryAmount = 30
    } else if (Math.random() < 0.85) {
      recoveryAmount = 25
    } else {
      recoveryAmount = 15
    }

    if (recoveryAmount !== 0 && recoveryAmount !== 100) {
      const adjustRecoveryAmount = getRandomValue(-2, 2)
      recoveryAmount = recoveryAmount + adjustRecoveryAmount
    }

    const oldPlayerHp = playerStatus.hp

    let newPlayerHp = oldPlayerHp + recoveryAmount

    if (newPlayerHp > playerStatus.max_hp) {
      newPlayerHp = playerStatus.max_hp
    }

    localMove.payload.recoveryAmount = recoveryAmount

    nextPlayerStatus.hp = newPlayerHp
    nextPlayerStatus.heal_remains = playerStatus.heal_remains - 1

    if (playerStatus.must_critical) {
      nextPlayerStatus.must_critical = false
    }

    if (opponentStatus.is_defence) {
      nextOpponentStatus.is_defence = false
    }

    updateGamePlayer({
      gameId: game.id,
      playerKey: playerKey,
      payload: nextPlayerStatus
    })

    updateGamePlayer({
      gameId: game.id,
      playerKey: opponentPlayerKey,
      payload: nextOpponentStatus
    })
  }

  createMessage(text) {
    console.log('createMessage', this.socket.id, text)

    const player = this.findSocketPlayer(this.socket.id)

    if (!player) {
      throw new Error('Failed to create a amessage: The player not found')
    }

    const message = createMessage(text, player)

    addMessage(message)

    this.io.emit('message:created', message)
  }

  deleteMessage(messageId) {
    console.log('deleteMessage', this.socket.id, messageId)

    const message = selectMessage(messageId)

    if (!message) {
      throw new Error('Failed to delete a amessage: The message not found')
    }

    removeMessage(message.id)

    this.io.emit('message:deleted', message.id)
  }

  socketDisconnecting() {
    console.log('socketDisconnecting', this.socket.id)

    const player = this.findSocketPlayer(this.socket.id)

    if (player) {
      // ignore player not found error
      this.leavePlayerRoom(player.id)

      this.io.emit('player:updated', selectPlayer(player.id))
    }
  }

  socketDisconnect() {
    console.log('socketDisconnect', this.socket.id)

    this.removeEventListeners()
  }

  roomCreated(room) {
    console.log('roomCreated', room, this.socket.id)
  }

  roomJoined(room, socketId) {
    console.log('roomJoined', room, socketId, this.socket.id)
  }

  getRooms() {
    return this.io.of('/').adapter.rooms
  }

  getPlayerRooms() {
    const rooms = this.getRooms()
    const players = selectPlayers()

    return new Map(
      // eslint-disable-next-line no-unused-vars
      [...rooms].filter(([roomId, socketIds]) =>
        players.some(player => player.id === roomId)
      )
    )
  }

  joinPlayerRoom(playerId) {
    console.log('joinPlayerRoom', playerId)

    this.socket.join(playerId)

    updatePlayer({
      playerId: playerId,
      payload: { socket_ids: this.getPlayerSocketIds(playerId) }
    })
  }

  leavePlayerRoom(playerId) {
    console.log('leavePlayerRoom', playerId)

    this.socket.leave(playerId)

    updatePlayer({
      playerId: playerId,
      payload: { socket_ids: this.getPlayerSocketIds(playerId) }
    })
  }

  findSocketPlayerId(socketId) {
    const playerRooms = this.getPlayerRooms()

    for (const [roomId, socketIds] of playerRooms.entries()) {
      if (socketIds.has(socketId)) return roomId
    }
  }

  findSocketPlayer(socketId) {
    const playerId = this.findSocketPlayerId(socketId)

    if (playerId) {
      return selectPlayer(playerId)
    }
  }

  findPlayerRoom(playerId) {
    return this.io.sockets.adapter.rooms.get(playerId)
  }

  getPlayerSocketIds(playerId) {
    const playerRoom = this.findPlayerRoom(playerId)

    return playerRoom ? Array.from(playerRoom.values()) : []
  }

  getBattlePlayerKey = (battle, playerId) => {
    const playerKey = Object.keys(battle.players).find(
      playerKey => battle.players[playerKey].id === playerId
    )

    return Number.parseInt(playerKey)
  }

  getBattleOpponentPlayer = (battle, playerId) => {
    const playerKey = this.getBattlePlayerKey(battle, playerId)

    if (playerKey) {
      const opponentPlayerKey = playerKey === 1 ? 2 : 1
      const opponentPlayerId = battle.players[opponentPlayerKey].id

      return selectPlayer(opponentPlayerId)
    }
  }

  tokenExpAdd = async (collectionId, tokenId, dexp) => {
    const newToken = await addMoralisTokenExp(collectionId, tokenId, dexp)

    console.log(
      `Show added tokenExp from Moralis DB. ID:${collectionId} - ${tokenId}, Exp : ${newToken.exp}, startBlockNumber : ${newToken.startBlockNumber}`
    )

    return newToken
  }

  tokenExpGet = async (collectionId, tokenId) => {
    const tokenExp = await getMoralisTokenExp(collectionId, tokenId)

    console.log(
      `Show tokenExp from Moralis DB. ID:${collectionId} - ${tokenId}, Exp : ${tokenExp.exp}, startBlockNumber : ${tokenExp.startBlockNumber}`
    )

    return tokenExp
  }

  eventListeners = {
    'auth:login': async (...args) => {
      try {
        await waitProcess(PROCESS_LOGIN)

        PROCESS.PROCESS_LOGIN = true

        await this.login(...args)

        PROCESS.PROCESS_LOGIN = false
      } catch (error) {
        PROCESS.PROCESS_LOGIN = false

        this.errorHandler(error)
      }
    },
    'auth:logout': (...args) => {
      try {
        this.logout(...args)
      } catch (error) {
        this.errorHandler(error)
      }
    },
    'player:renew': (...args) => {
      try {
        this.renewPlayer(...args)
      } catch (error) {
        this.errorHandler(error)
      }
    },
    'player:update': async (...args) => {
      try {
        this.updatePlayer(...args)
      } catch (error) {
        this.errorHandler(error)
      }
    },
    'battle:create': (...args) => {
      try {
        this.createBattle(...args)
      } catch (error) {
        this.errorHandler(error)
      }
    },
    'battle:join': (...args) => {
      try {
        this.joinBattle(...args)
      } catch (error) {
        this.errorHandler(error)
      }
    },
    'battle:rush': (...args) => {
      try {
        this.rushBattle(...args)
      } catch (error) {
        this.errorHandler(error)
      }
    },
    'battle:continue': (...args) => {
      try {
        this.continueBattle(...args)
      } catch (error) {
        this.errorHandler(error)
      }
    },
    'battle:delete': (...args) => {
      try {
        this.deleteBattle(...args)
      } catch (error) {
        this.errorHandler(error)
      }
    },
    'game:start': (...args) => {
      try {
        this.startGame(...args)
      } catch (error) {
        this.errorHandler(error)
      }
    },
    'game:load': (...args) => {
      try {
        this.loadGame(...args)
      } catch (error) {
        this.errorHandler(error)
      }
    },
    'game:finish': (...args) => {
      try {
        this.finishGame(...args)
      } catch (error) {
        this.errorHandler(error)
      }
    },
    'game:abort': (...args) => {
      try {
        this.abortGame(...args)
      } catch (error) {
        this.errorHandler(error)
      }
    },
    'game:move': (...args) => {
      try {
        this.moveGame(...args)
      } catch (error) {
        this.errorHandler(error)
      }
    },
    'game:moveCPU': (...args) => {
      try {
        this.moveCPUGame(...args)
      } catch (error) {
        this.errorHandler(error)
      }
    },
    'message:create': (...args) => {
      try {
        this.createMessage(...args)
      } catch (error) {
        this.errorHandler(error)
      }
    },
    'message:delete': (...args) => {
      try {
        this.deleteMessage(...args)
      } catch (error) {
        this.errorHandler(error)
      }
    },
    'socket:disconnecting': (...args) => {
      try {
        this.socketDisconnecting(...args)
      } catch (error) {
        this.errorHandler(error)
      }
    },
    'socket:disconnect': (...args) => {
      try {
        this.socketDisconnect(...args)
      } catch (error) {
        this.errorHandler(error)
      }
    },
    'room:created': (...args) => {
      try {
        this.roomCreated(...args)
      } catch (error) {
        this.errorHandler(error)
      }
    },
    'room:joined': (...args) => {
      try {
        this.roomJoined(...args)
      } catch (error) {
        this.errorHandler(error)
      }
    },
    /*
    'test:test': (...args) => {
      console.log(...args)
      try {
        this.test(...args)
      } catch (error) {
        this.errorHandler(error)
      }
    },
    */
    'tokenExp:get': (...args) => {
      console.log(...args)
      try {
        this.tokenExpGet(...args)
      } catch (error) {
        this.errorHandler(error)
      }
    },
    'tokenExp:add': (...args) => {
      console.log(...args)
      try {
        this.tokenExpAdd(...args)
      } catch (error) {
        this.errorHandler(error)
      }
    }
  }

  addEventListeners() {
    console.log('addEventListeners', this.socket.id)

    this.socket.on('tokenExp:get', this.eventListeners['tokenExp:get'])
    this.socket.on('tokenExp:add', this.eventListeners['tokenExp:add'])

    this.socket.on('auth:login', this.eventListeners['auth:login'])
    this.socket.on('auth:logout', this.eventListeners['auth:logout'])
    this.socket.on('player:renew', this.eventListeners['player:renew'])
    this.socket.on('player:update', this.eventListeners['player:update'])
    this.socket.on('battle:create', this.eventListeners['battle:create'])
    this.socket.on('battle:join', this.eventListeners['battle:join'])
    this.socket.on('battle:rush', this.eventListeners['battle:rush'])
    this.socket.on('battle:continue', this.eventListeners['battle:continue'])
    this.socket.on('battle:delete', this.eventListeners['battle:delete'])
    this.socket.on('game:start', this.eventListeners['game:start'])
    this.socket.on('game:load', this.eventListeners['game:load'])
    this.socket.on('game:finish', this.eventListeners['game:finish'])
    this.socket.on('game:abort', this.eventListeners['game:abort'])
    this.socket.on('game:move', this.eventListeners['game:move'])
    this.socket.on('game:moveCPU', this.eventListeners['game:moveCPU'])
    this.socket.on('message:create', this.eventListeners['message:create'])
    this.socket.on('message:delete', this.eventListeners['message:delete'])
    this.socket.on('disconnecting', this.eventListeners['socket:disconnecting'])
    this.socket.on('disconnect', this.eventListeners['socket:disconnect'])
    this.io
      .of('/')
      .adapter.on('create-room', this.eventListeners['room:created'])
    this.io.of('/').adapter.on('join-room', this.eventListeners['room:joined'])
  }

  removeEventListeners() {
    console.log('removeEventListeners', this.socket.id)

    this.socket.off('tokenExp:get', this.eventListeners['tokenExp:get'])
    this.socket.off('tokenExp:add', this.eventListeners['tokenExp:add'])

    this.socket.off('auth:login', this.eventListeners['auth:login'])
    this.socket.off('auth:logout', this.eventListeners['auth:logout'])
    this.socket.off('player:renew', this.eventListeners['player:renew'])
    this.socket.off('player:update', this.eventListeners['player:update'])
    this.socket.off('battle:create', this.eventListeners['battle:create'])
    this.socket.off('battle:join', this.eventListeners['battle:join'])
    this.socket.off('battle:rush', this.eventListeners['battle:rush'])
    this.socket.off('battle:continue', this.eventListeners['battle:continue'])
    this.socket.off('battle:delete', this.eventListeners['battle:delete'])
    this.socket.off('game:start', this.eventListeners['game:start'])
    this.socket.off('game:load', this.eventListeners['game:load'])
    this.socket.off('game:finish', this.eventListeners['game:finish'])
    this.socket.off('game:abort', this.eventListeners['game:abort'])
    this.socket.off('game:move', this.eventListeners['game:move'])
    this.socket.off('game:moveCPU', this.eventListeners['game:moveCPU'])
    this.socket.off('message:create', this.eventListeners['message:create'])
    this.socket.off('message:delete', this.eventListeners['message:delete'])
    this.socket.off(
      'disconnecting',
      this.eventListeners['socket:disconnecting']
    )
    this.socket.off('disconnect', this.eventListeners['socket:disconnect'])
    this.io
      .of('/')
      .adapter.off('create-room', this.eventListeners['room:created'])
    this.io.of('/').adapter.off('join-room', this.eventListeners['room:joined'])
  }

  removeAllEventListeners() {
    console.log('removeAllEventListeners', this.socket.id)

    this.socket.removeAllListeners()
  }

  errorHandler(error) {
    console.log('errorHandler', error)

    const player = this.findSocketPlayer(this.socket.id)

    if (player) {
      const { message, stack } = error

      this.io.to(player.id).emit('game:error', { message, stack })
    } else {
      throw new Error(error)
    }
  }
}

module.exports = {
  GameManager
}
