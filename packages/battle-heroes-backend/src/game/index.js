const { v4: uuidv4 } = require('uuid')
const { findUser } = require('../user')
const { createBattle } = require('../battle')
const { createMessage } = require('../message')
const { selectNFT } = require('../NFT/selectors')
const { postDiscord } = require('../utils/discord')
const { selectGame, selectBattleGame } = require('./selectors')
const { addPlayer, updatePlayer } = require('../player/actions')
const { createPlayer, updatePlayerStats } = require('../player')
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
  PLAYER_STATE,
  PLAYER_MOVE,
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
  selectUserPlayer
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
    }, 500)
  })
}

const getRandomValue = (min, max) =>
  Math.floor(Math.random() * (max - min) + min)

const createStatus = () => {
  const maxHp = getRandomValue(90, 110)
  const attack = getRandomValue(15, 25)
  const defense = getRandomValue(15, 25)
  const int = getRandomValue(20, 35)
  const speed = getRandomValue(15, 25)

  return {
    max_hp: maxHp,
    hp: maxHp,
    attack: attack,
    defense: defense,
    int: int,
    speed: speed,
    criticalRate: 0.05,
    missRate: 0.1,
    isDefence: false,
    mustCritical: false,
    attack_remains: 3,
    spell_remains: 1,
    heal_remains: 1
  }
}

const createGame = battle => {
  const status = {
    1: createStatus(),
    2: createStatus()
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

class GameManager {
  constructor(io, socket) {
    this.io = io
    this.socket = socket
  }

  listen(callback) {
    try {
      this.addEventListeners()

      callback()
    } catch (error) {
      this.removeEventListeners()

      callback(error)
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

      this.socket.broadcast.emit('player:update', selectPlayer(player.id))
    } else {
      try {
        const newUser = await findUser(user.id)
        const newPlayer = await createPlayer(newUser)

        addPlayer(newPlayer)

        this.joinPlayerRoom(newPlayer.id)

        this.socket.broadcast.emit('player:player', selectPlayer(newPlayer.id))
      } catch (error) {
        return callback({
          status: false,
          message: `Failed to login: ${error.message}`
        })
      }
    }

    const players = selectPlayers()
    const battles = selectBattles()
    const messages = selectMessages()

    callback({
      status: true,
      message: 'Successfully logged in',
      players,
      battles,
      messages
    })
  }

  logout(callback) {
    console.log('logout', this.socket.id)

    const player = this.findSocketPlayer(this.socket.id)

    if (player) {
      this.leavePlayerRoom(player.id)

      this.io.emit('player:update', selectPlayer(player.id))

      callback({
        status: true,
        message: 'Successfully logged out'
      })
    } else {
      callback({
        status: false,
        message: 'Failed to logout'
      })
    }
  }

  startGame(battleId, callback) {
    console.log('startGame', this.socket.id, battleId)

    const battle = selectBattle(battleId)

    if (!battle) {
      return callback({
        status: false,
        message: 'Failed to start a game: The battle not found'
      })
    }

    if (battle.state === BATTLE_STATE.ENDED) {
      return callback({
        status: false,
        message: 'Failed to start a game: The battle has already ended'
      })
    }

    const game = selectBattleGame(battle.id)

    if (game) {
      callback({
        status: true,
        message: 'Start game',
        game
      })
    } else {
      const newGame = createGame(battle)

      addGame(newGame)

      updateBattle({
        battleId: battle.id,
        payload: { state: BATTLE_STATE.STARTED }
      })

      callback({
        status: true,
        message: 'Start game',
        game: newGame
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
        this.deleteBattle(battle.id, () => {})
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
        const battleCache = battle

        this.deleteBattle(battle.id, ({ status }) => {
          if (status) {
            const player = this.findSocketPlayer(this.socket.id)

            if (player) {
              // updatePlayerStats(player.id, {
              //   lose: player.lose + 1
              // })
              //   .then(() => {
              //     this.io.emit('player:update', selectPlayer(player.id))
              //   })
              //   .catch(error => {
              //     throw new Error(
              //       `Failed to update player stats: ${error.message}: ${error.stack}`
              //     )
              //   })

              const opponentPlayer = this.getBattleOpponentPlayer(
                battleCache,
                player.id
              )

              if (opponentPlayer) {
                // updatePlayerStats(opponentPlayer.id, {
                //   exp: opponentPlayer.exp + 3,
                //   win: opponentPlayer.win + 1
                // })
                //   .then(() => {
                //     this.io.emit(
                //       'player:update',
                //       selectPlayer(opponentPlayer.id)
                //     )
                //   })
                //   .catch(error => {
                //     throw new Error(
                //       `Failed to update player stats: ${error.message}: ${error.stack}`
                //     )
                //   })

                this.io.to(opponentPlayer.id).emit('game:aborted', game.id)
              }
            }
          } else {
            // ignore error
          }
        })
      }

      callback({
        status: true,
        message: 'The game aborted'
      })
    } else {
      callback({
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
        isOpponentDefence: opponentStatus.isDefence
      }

      this.attack(payload)
    } else if (move === PLAYER_MOVE.SPELL) {
      localMove.payload = {
        damage: 0,
        isFinish: false,
        isOpponentDefence: opponentStatus.isDefence
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

      updatePlayerStats(player.id, {
        exp: player.exp + 3,
        win: player.win + 1
      })
        .then(() => {
          this.io.emit('player:update', selectPlayer(player.id))
        })
        .catch(error => {
          throw new Error(
            `Failed to update player stats: ${error.message}: ${error.stack}`
          )
        })

      updatePlayerStats(opponentPlayer.id, {
        exp: opponentPlayer.exp + 1,
        lose: opponentPlayer.lose + 1
      })
        .then(() => {
          this.io.emit('player:update', selectPlayer(opponentPlayer.id))
        })
        .catch(error => {
          const { message, stack } = error
          // send to ooponent player
          this.io.to(opponentPlayer.id).emit('game:error', {
            message: `Failed to update player status: ${message}`,
            stack: stack
          })
        })

      updateBattle({
        battleId: battle.id,
        payload: { state: BATTLE_STATE.ENDED }
      })

      this.io.emit('battle:update', selectBattle(battle.id))

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

    this.io.emit('game:update', selectGame(game.id))
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
      throw new Error('Failed to move: Can not use attack')
    }

    const nextPlayerStatus = {}
    const nextOpponentStatus = {}

    let damage = 0
    let isMiss = false
    let isCritical = false
    let isMustCritical = false
    let isFinish = false

    if (!playerStatus.mustCritical && Math.random() < playerStatus.missRate) {
      isMiss = true
    } else {
      damage = Math.floor(
        (playerStatus.attack * 100) / (100 + opponentStatus.defense)
      )

      if (!playerStatus.mustCritical && opponentStatus.isDefence) {
        damage = Math.floor(damage * 0.7)
      }

      if (playerStatus.mustCritical) {
        isMustCritical = true
        damage = Math.floor(damage * 1.5)
        nextPlayerStatus.mustCritical = false
      } else if (Math.random() < playerStatus.criticalRate) {
        isCritical = true
        damage = Math.floor(damage * 1.5)
      } else {
        const adjustDamage = getRandomValue(-2, 2)
        damage = damage + adjustDamage
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
          nextOpponentStatus.criticalRate = 0.15
        } else if (oldOpponentHpRate >= 0.05 && newOpponentHpRate < 0.05) {
          nextOpponentStatus.criticalRate = 0.25
        }
      }

      localMove.payload.damage = damage
      localMove.payload.isMiss = isMiss
      localMove.payload.isCritical = isCritical
      localMove.payload.isMustCritical = isMustCritical
      localMove.payload.isFinish = isFinish

      nextPlayerStatus.attack_remains = playerStatus.attack_remains - 1

      if (opponentStatus.isDefence) {
        nextOpponentStatus.isDefence = false
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
      throw new Error('Failed to move: Can not use spell')
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

    if (opponentStatus.isDefence) {
      nextOpponentStatus.isDefence = false
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
    nextPlayerStatus.mustCritical = mustCritical
    nextPlayerStatus.isDefence = true

    if (opponentStatus.isDefence) {
      nextOpponentStatus.isDefence = false
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
      throw new Error('Failed to move: Can not use heal')
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

    if (opponentStatus.isDefence) {
      nextOpponentStatus.isDefence = false
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

  createBattle(NFTId, callback) {
    console.log('createBattle', this.socket.id, NFTId)

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
        message: 'Failed to create a battle: The player must be own the NFT'
      })
    }

    if (selectPlayerBattle(player.id)) {
      return callback({
        status: false,
        message:
          'Failed to create a game: The player already has the another battle'
      })
    }

    const battle = createBattle(player.id, NFTId)

    addBattle(battle)

    updatePlayer({
      playerId: player.id,
      payload: { state: PLAYER_STATE.STANDBY }
    })

    this.io.emit('player:update', selectPlayer(player.id))
    this.io.emit('battle:battle', selectBattle(battle.id))

    postDiscord({
      type: DISCORD_POST_TYPE.BATTLE_CREATED,
      payload: {
        player: selectPlayer(player.id),
        battle: selectBattle(battle.id)
      }
    })

    callback({
      status: true,
      message: 'The battle created'
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
      updatePlayer({
        playerId: player.id,
        payload: { state: PLAYER_STATE.IDLE }
      })

      this.io.emit('player:update', selectPlayer(player.id))

      const opponentPlayer = this.getBattleOpponentPlayer(battle, player.id)
      console.log('opponentPlayer', opponentPlayer)

      if (opponentPlayer) {
        updatePlayer({
          playerId: opponentPlayer.id,
          payload: { state: PLAYER_STATE.IDLE }
        })

        this.io.emit('player:update', selectPlayer(opponentPlayer.id))
      }
    }

    removeBattle(battleId)

    this.io.emit('battle:delete', battleId)

    callback({
      status: true,
      message: 'The battle deleted'
    })
  }

  joinBattle(battleId, NFTId) {
    console.log('joinBattle', this.socket.id, battleId, NFTId)

    const player = this.findSocketPlayer(this.socket.id)

    if (!player) {
      throw new Error('Failed to join the battle: The player not found')
    }

    if (!player.nft_ids.includes(NFTId)) {
      throw new Error(
        'Failed to join the battle: The player does not own the NFT'
      )
    }

    const playerBattle = selectPlayerBattle(player.id)

    if (playerBattle) {
      throw new Error(
        'Failed to join the battle: The player already has the another battle'
      )
    }

    const battle = selectBattle(battleId)

    if (!battle) {
      throw new Error('Battle not found')
    }

    if (battle.state !== BATTLE_STATE.CREATED) {
      throw new Error(
        `Failed to join the battle: The battle state is "${battle.state.toLowerCase()}"`
      )
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
      payload: { state: BATTLE_STATE.READY }
    })

    this.io.emit('battle:update', selectBattle(battle.id))
    this.io.emit('player:update', selectPlayer(player.id))
    this.io.emit('player:update', selectPlayer(opponentPlayer.id))

    this.io.to(player.id).emit('battle:matched', battle.id)
    this.io.to(opponentPlayer.id).emit('battle:matched', battle.id)

    postDiscord({
      type: DISCORD_POST_TYPE.BATTLE_MATCHED,
      payload: {
        player1: selectPlayer(player.id),
        player2: selectPlayer(opponentPlayer.id),
        battle: selectBattle(battle.id)
      }
    })
  }

  leaveBattle(battleId) {
    console.log('leaveBattle', battleId, this.socket.id)
  }

  randomBattle() {
    console.log('randomBattle', this.socket.id)
  }

  createMessage(text) {
    console.log('createMessage', this.socket.id, text)

    const player = this.findSocketPlayer(this.socket.id)

    if (!player) {
      throw new Error('Failed to create a amessage: The player not found')
    }

    const message = createMessage(text, player)

    addMessage(message)

    this.io.emit('message:message', message)
  }

  deleteMessage(messageId) {
    console.log('deleteMessage', this.socket.id, messageId)

    const message = selectMessage(messageId)

    if (!message) {
      throw new Error('Failed to delete a amessage: The message not found')
    }

    removeMessage(message.id)

    this.io.emit('message:delete', message.id)
  }

  async updatePlayer(user, callback) {
    console.log('updatePlayer', this.socket.id, user)

    if (!user) {
      return callback({
        status: false,
        message: 'Failed to update player: The user not found'
      })
    }

    try {
      const updatedUser = await findUser(user.id)
      const updatedPlayer = await createPlayer(updatedUser)

      updatePlayer({
        playerId: updatedPlayer.id,
        payload: { ...updatedPlayer }
      })

      callback({
        status: true,
        message: 'The player updated',
        player: updatedPlayer
      })

      this.socket.broadcast.emit(
        'player:update',
        selectPlayer(updatedPlayer.id)
      )
    } catch (error) {
      return callback({
        status: false,
        message: `Failed to update player: ${error.message}`
      })
    }
  }

  async updatePlayerStats(stats) {
    console.log('updatePlayerStats', this.socket.id, stats)

    const player = this.findSocketPlayer(this.socket.id)

    if (!player) {
      throw new Error('Failed to update player stats : The player not found')
    }

    try {
      await updatePlayerStats(player.id, {
        exp: player.exp + stats.exp,
        win: player.win + stats.win,
        lose: player.lose + stats.lose
      })

      const updatedPlayer = selectPlayer(player.id)

      this.io.emit('player:update', updatedPlayer)

      this.socket.broadcast.emit('player:update', updatedPlayer)
    } catch (error) {
      throw new Error(
        `Failed to update player stats: ${error.message}: ${error.stack}`
      )
    }
  }

  socketDisconnecting() {
    console.log('socketDisconnecting', this.socket.id)

    const player = this.findSocketPlayer(this.socket.id)

    if (player) {
      // ignore player not found error
      this.leavePlayerRoom(player.id)

      this.io.emit('player:update', selectPlayer(player.id))
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

  eventListeners = {
    'game:login': async (...args) => {
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
    'game:logout': (...args) => {
      try {
        this.logout(...args)
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
    'battle:create': (...args) => {
      try {
        this.createBattle(...args)
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
    'battle:join': (...args) => {
      try {
        this.joinBattle(...args)
      } catch (error) {
        this.errorHandler(error)
      }
    },
    'battle:leave': (...args) => {
      try {
        this.leaveBattle(...args)
      } catch (error) {
        this.errorHandler(error)
      }
    },
    'battle:random': (...args) => {
      try {
        this.randomBattle(...args)
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
    'player:update': (...args) => {
      try {
        this.updatePlayer(...args)
      } catch (error) {
        this.errorHandler(error)
      }
    },
    'player:updateStats': (...args) => {
      try {
        this.updatePlayerStats(...args)
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
    }
  }

  addEventListeners() {
    console.log('addEventListeners', this.socket.id)

    this.socket.on('game:login', this.eventListeners['game:login'])
    this.socket.on('game:logout', this.eventListeners['game:logout'])
    this.socket.on('game:start', this.eventListeners['game:start'])
    this.socket.on('game:load', this.eventListeners['game:load'])
    this.socket.on('game:finish', this.eventListeners['game:finish'])
    this.socket.on('game:abort', this.eventListeners['game:abort'])
    this.socket.on('game:move', this.eventListeners['game:move'])
    this.socket.on('battle:create', this.eventListeners['battle:create'])
    this.socket.on('battle:delete', this.eventListeners['battle:delete'])
    this.socket.on('battle:join', this.eventListeners['battle:join'])
    this.socket.on('battle:leave', this.eventListeners['battle:leave'])
    this.socket.on('battle:random', this.eventListeners['battle:random'])
    this.socket.on('message:create', this.eventListeners['message:create'])
    this.socket.on('message:delete', this.eventListeners['message:delete'])
    this.socket.on('player:update', this.eventListeners['player:update'])
    this.socket.on(
      'player:updateStats',
      this.eventListeners['player:updateStats']
    )
    this.socket.on('disconnecting', this.eventListeners['socket:disconnecting'])
    this.socket.on('disconnect', this.eventListeners['socket:disconnect'])
    this.io
      .of('/')
      .adapter.on('create-room', this.eventListeners['room:created'])
    this.io.of('/').adapter.on('join-room', this.eventListeners['room:joined'])
  }

  removeEventListeners() {
    console.log('removeEventListeners', this.socket.id)

    this.socket.off('game:login', this.eventListeners['game:login'])
    this.socket.off('game:logout', this.eventListeners['game:logout'])
    this.socket.off('game:start', this.eventListeners['game:start'])
    this.socket.off('game:load', this.eventListeners['game:load'])
    this.socket.off('game:finish', this.eventListeners['game:finish'])
    this.socket.off('game:abort', this.eventListeners['game:abort'])
    this.socket.off('game:move', this.eventListeners['game:move'])
    this.socket.off('battle:create', this.eventListeners['battle:create'])
    this.socket.off('battle:delete', this.eventListeners['battle:delete'])
    this.socket.off('battle:join', this.eventListeners['battle:join'])
    this.socket.off('battle:leave', this.eventListeners['battle:leave'])
    this.socket.off('battle:random', this.eventListeners['battle:random'])
    this.socket.off('player:update', this.eventListeners['player:update'])
    this.socket.off(
      'player:updateStats',
      this.eventListeners['player:updateStats']
    )
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
