<template>
  <ErrorScreen v-if="!NFTId" message="The battle not found">
    <p>The battle has already finished or aborted</p>
    <p style="margin-top: 16px">
      <BaseButton type="primary" @click="leaveBattle">
        <FontAwesomeIcon icon="arrow-left" />
        戻る
      </BaseButton>
    </p>
  </ErrorScreen>

  <BattleSplashScreen
    v-else-if="!game"
    type="start"
    :player1="player1"
    :player2="player2"
    :nft1="NFT1"
    :nft2="NFT2"
  />

  <Game
    v-else
    :game="game"
    :messages="messages"
    :allow-continue="true"
    :aborted="gameAborted"
    :playable="playable"
    :player1="player1"
    :player2="player2"
    :nft1="NFT1"
    :nft2="NFT2"
    @attack="onAttack"
    @heal="onHeal"
    @finish="onGameFinished"
    @abort="onGameAbort"
    @continue="onContinue"
  />
</template>

<script>
import Game from '@/components/Game'
import { mapGetters, mapActions } from 'vuex'
import { BATTLE_STATE, PLAYER_MOVE } from '@/utils/constants'
import ErrorScreen from '@/components/ErrorScreen'
import { MUSIC, SOUND_EFFECT } from '@/utils/constants'
import BattleSplashScreen from '@/components/BattleSplashScreen'

import Wolfman from '@/assets/json/monsters/1.json'
import Ghost from '@/assets/json/monsters/2.json'
import Beans from '@/assets/json/monsters/3.json'
import Worm from '@/assets/json/monsters/4.json'
import Dragon from '@/assets/json/monsters/5.json'

const CPU = {
  id: 0,
  user_id: 0,
  name: 'Pixel Monsters',
  avatar_url: '',
  address: '',
  socket_ids: [1],
  nft_ids: [],
  exp: 0,
  win: 0,
  lose: 0,
  state: 'IDLE'
}

const getRandomValue = (min, max) =>
  Math.floor(Math.random() * (max - min) + min)

const createBattle = (playerId, NFTId) => {
  return {
    id: 0,
    players: {
      1: {
        id: playerId,
        NFT_id: NFTId
      },
      2: {
        id: null,
        NFT_id: null
      }
    },
    state: BATTLE_STATE.CREATED
  }
}

const createStatus = () => {
  const maxHp = getRandomValue(90, 110)
  const attack = getRandomValue(15, 25)
  const defense = getRandomValue(15, 25)
  const speed = getRandomValue(15, 25)

  return {
    max_hp: maxHp,
    hp: maxHp,
    attack: attack,
    defense: defense,
    speed: speed,
    criticalRate: 0.05,
    missRate: 0.1,
    heal: 1
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

  status[secondPlayer].max_hp = secondPlayerMaxHp
  status[secondPlayer].hp = secondPlayerMaxHp
  status[secondPlayer].attack = secondPlayerAttack
  status[secondPlayer].defense = secondPlayerDefence

  return {
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

export default {
  name: 'BattleOffline',

  components: {
    Game,
    ErrorScreen,
    BattleSplashScreen
  },

  data() {
    return {
      NFTId: null,
      cachedBattle: null,
      playable: true,
      game: null,
      gameAborting: false,
      gameAborted: false,
      gameFinished: false,
      monsters: [Wolfman, Ghost, Beans, Worm, Dragon],
      messages: []
    }
  },

  computed: {
    ...mapGetters({
      findNFT: 'NFT/find',
      player: 'game/player',
      findBattle: 'battle/find',
      findPlayer: 'player/find',
      playerBattle: 'game/playerBattle'
    }),

    actualBattle() {
      return this.findBattle(this.$route.params.cpuId)
    },

    players() {
      return this.battle.players
    },

    isBattleCreated() {
      return this.battle.state === BATTLE_STATE.CREATED
    },

    isBattleReady() {
      return this.battle.state === BATTLE_STATE.READY
    },

    isBattleStarted() {
      return this.battle.state === BATTLE_STATE.STARTED
    },

    isBattleEnded() {
      return this.battle.state === BATTLE_STATE.ENDED
    },

    isPlayerBattle() {
      return true
    },

    canStartBattle() {
      return true
    },

    canJoinBattle() {
      return true
    },

    canLeaveBattle() {
      return (
        !this.game || this.gameAborted || this.gameAborting || this.gameFinished
      )
    },

    player1() {
      return this.player
    },

    player2() {
      return CPU
    },

    NFT1() {
      return this.findNFT(this.NFTId)
    },

    NFT2() {
      return this.monsters[0]
    },

    playerKey() {
      return 1
    },

    opponentPlayerKey() {
      return this.playerKey === 1 ? 2 : 1
    },

    opponentPlayer() {
      return this.opponentPlayerKey === 1 ? this.player1 : this.player2
    },

    playerNFT() {
      return this.playerKey === 1 ? this.nft1 : this.nft2
    },

    opponentNFT() {
      return this.opponentPlayerKey === 1 ? this.nft1 : this.nft2
    },

    status() {
      return this.game.players
    },

    currentPlayerKey() {
      return this.game.current_player
    },

    currentOpponentKey() {
      return this.currentPlayerKey === 1 ? 2 : 1
    },

    currentPlayer() {
      return this.currentPlayerKey === 1 ? this.player1 : this.player2
    },

    currentOpponentPlayer() {
      return this.currentOpponentKey === 1 ? this.player1 : this.player2
    },

    currentPlayerStatus() {
      return this.status[this.currentPlayerKey]
    },

    currentOpponentStatus() {
      return this.status[this.currentOpponentKey]
    },

    isGameFinished() {
      return this.playerStatus.hp <= 0 || this.opponentStatus.hp <= 0
    },

    isOpponentPlayerOffline() {
      return !this.opponentPlayer.socket_ids.length > 0
    },

    canAttack() {
      return this.canMove
    },

    canHeal() {
      return (
        this.canMove &&
        this.playerStatus.hp < this.playerStatus.max_hp &&
        this.playerStatus.heal > 0
      )
    },

    canLeaveGame() {
      return !this.playable || this.aborted || this.isGameFinished
    },

    canMove() {
      return (
        this.playable &&
        !this.aborted &&
        !this.isGameFinished &&
        !this.moving &&
        this.currentPlayerKey === this.playerKey
      )
    }
  },

  created() {
    console.log('Battle:created')

    if (this.$route.params.NFTId) {
      this.NFTId = Number.parseInt(this.$route.params.NFTId)

      this.battle = createBattle(this.player.id, this.NFTId)

      this.shuffleMonsters()

      this.playAudio(SOUND_EFFECT.ENCOUNTER)

      setTimeout(() => {
        this.game = createGame(this.battle)

        this.messages.push('バトルスタート！')

        this.playAudio(MUSIC.BATTLE)

        if (this.game && this.game.current_player === 2) {
          setTimeout(() => {
            this.onAttack()
          }, 1500)
        }
      }, 3000)
    }
  },

  mounted() {
    console.log('Battle:mounted')
  },

  beforeUnmount() {
    console.log('Battle:beforeUnmount')

    this.stopAudio(MUSIC.BATTLE)
  },

  methods: {
    ...mapActions({
      playAudio: 'audio/play',
      stopAudio: 'audio/stop',
      addNotification: 'notification/add'
    }),

    shuffleMonsters() {
      return this.monsters.sort(() => Math.random() - 0.5)
    },

    leaveBattle() {
      console.log('leaveBattle')

      return this.$router.push(
        {
          name: 'battles'
        },
        () => {}
      )
    },

    onGameAbort() {
      console.log('onGameAbort')

      this.gameAborting = true

      this.leaveBattle().then(() => {
        this.gameAborting = false
      })
    },

    onGameAborted(gameId) {
      console.log('onGameAborted', gameId)

      this.gameAborted = true
    },

    onGameFinished() {
      console.log('onGameFinished')

      this.gameFinished = true
    },

    onContinue() {
      console.log('onContinue')

      this.stopAudio(MUSIC.BATTLE)

      this.shuffleMonsters()

      this.playAudio(SOUND_EFFECT.ENCOUNTER)

      this.game = null
      this.gameAborting = false
      this.gameAborted = false
      this.gameFinished = false

      setTimeout(() => {
        this.game = createGame(this.battle)

        this.playAudio(MUSIC.BATTLE)

        if (this.game && this.game.current_player === 2) {
          setTimeout(() => {
            this.onAttack()
          }, 1500)
        }
      }, 3000)
    },

    onAttack() {
      console.log('onAttack')

      if (this.gameAborting || this.gameAborted || this.gameFinished) return

      const move = {
        playerKey: this.currentPlayerKey,
        move: PLAYER_MOVE.ATTACK,
        payload: {
          isMiss: false,
          isCritical: false,
          isFinish: false,
          damage: 0
        }
      }

      const nextOpponentStatus = {}
      let damage = 0

      if (Math.random() < this.currentPlayerStatus.missRate) {
        move.payload.isMiss = true
      } else {
        damage = Math.floor(
          (this.currentPlayerStatus.attack * 100) /
            (100 + this.currentOpponentStatus.defense)
        )

        if (Math.random() < this.currentPlayerStatus.criticalRate) {
          move.payload.isCritical = true

          damage = Math.floor(damage * 1.5)
        } else {
          const adjustDamage = getRandomValue(-2, 2)
          damage = damage + adjustDamage
        }

        move.payload.damage = damage

        const oldOpponentHp = this.currentOpponentStatus.hp
        const oldOpponentHpRate =
          oldOpponentHp / this.currentOpponentStatus.max_hp

        let newOpponentHp = oldOpponentHp - damage
        const newOpponentHpRate =
          newOpponentHp / this.currentOpponentStatus.max_hp

        if (newOpponentHp < 0) {
          newOpponentHp = 0
        }

        nextOpponentStatus.hp = newOpponentHp

        if (newOpponentHp === 0) {
          move.payload.isFinish = true

          if (this.currentPlayer.id === this.player.id) {
            // player wins
            this.$socket.emit('player:updateStats', {
              exp: 3,
              win: 1,
              lose: 0
            })
          } else {
            // playe lose
            this.$socket.emit('player:updateStats', {
              exp: 1,
              win: 0,
              lose: 1
            })
          }
        } else {
          if (oldOpponentHpRate >= 0.25 && newOpponentHpRate < 0.25) {
            nextOpponentStatus.criticalRate = 0.15
          } else if (oldOpponentHpRate >= 0.05 && newOpponentHpRate < 0.05) {
            nextOpponentStatus.criticalRate = 0.25
          }
        }

        this.game.players[this.currentOpponentKey] = {
          ...this.game.players[this.currentOpponentKey],
          ...nextOpponentStatus
        }
      }

      this.game.moves.push(move)

      this.nextTurn()
    },

    onHeal() {
      console.log('onHeal')

      if (this.gameAborting || this.gameAborted || this.gameFinished) return

      if (this.currentPlayerStatus.heal <= 0) {
        throw new Error('Failed to move: Can not use heal')
      }

      const move = {
        playerKey: this.currentPlayerKey,
        move: PLAYER_MOVE.HEAL,
        payload: {
          recoveryAmount: 0
        }
      }

      const nextPlayerStatus = {}

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

      const oldPlayerHp = this.currentPlayerStatus.hp

      let newPlayerHp = oldPlayerHp + recoveryAmount

      if (newPlayerHp > this.currentPlayerStatus.max_hp) {
        newPlayerHp = this.currentPlayerStatus.max_hp
      }

      nextPlayerStatus.hp = newPlayerHp
      nextPlayerStatus.heal = this.currentPlayerStatus.heal - 1

      move.payload.recoveryAmount = recoveryAmount

      this.game.players[this.currentPlayerKey] = {
        ...this.game.players[this.currentPlayerKey],
        ...nextPlayerStatus
      }

      this.game.moves.push(move)

      this.nextTurn()
    },

    nextTurn() {
      const nextPlayer = this.game.current_player === 1 ? 2 : 1

      if (this.game.moves.length > 0) {
        const lastMove = this.game.moves[this.game.moves.length - 1]

        let player, opponentPlayer

        if (lastMove.playerKey === 1) {
          const playerId = this.game.players[1].id
          player = this.findPlayer(playerId)
          opponentPlayer = CPU
        } else {
          const playerId = this.game.players[1].id
          player = CPU
          opponentPlayer = this.findPlayer(playerId)
        }

        if (lastMove.move === PLAYER_MOVE.ATTACK) {
          this.messages.push(`${player.name} の攻撃！`)

          const { isMiss, isCritical, isFinish, damage } = {
            ...lastMove.payload
          }

          if (isMiss) {
            this.messages.push('ミス！')
            this.messages.push(
              `${opponentPlayer.name} にダメージを与えられない`
            )
          } else {
            if (isCritical) {
              this.playAudio(SOUND_EFFECT.ATTACK_CRITICAL)
              this.messages.push('クリティカルヒット！')
            } else {
              this.playAudio(SOUND_EFFECT.ATTACK)
            }

            if (damage > 0) {
              setTimeout(() => {
                this.playAudio(SOUND_EFFECT.DAMAGE)
              }, 100)
            }

            this.messages.push(
              `${opponentPlayer.name} に ${damage} のダメージを与えた！`
            )

            if (isFinish) {
              this.messages.push(`${opponentPlayer.name} は気絶してしまった！`)
              this.messages.push(`${player.name} の勝利！`)
            }
          }
        }

        if (lastMove.move === PLAYER_MOVE.HEAL) {
          this.messages.push(`${player.name} の回復！`)

          const { recoveryAmount } = {
            ...lastMove.payload
          }

          if (recoveryAmount === 0) {
            this.messages.push('ミス')
            this.messages.push(`${player.name} は HP を回復できなかった！`)
          } else {
            this.playAudio(SOUND_EFFECT.HEAL)

            this.messages.push(
              `${player.name} の HP が ${recoveryAmount} 回復した！`
            )
          }
        }
      }

      this.game.current_player = nextPlayer
      this.game.turn++

      if (this.game.current_player === 2) {
        setTimeout(() => {
          if (
            this.currentPlayerStatus.hp < 30 &&
            this.currentOpponentStatus.hp > 25 &&
            this.currentPlayerStatus.heal > 0
          ) {
            this.onHeal()
          } else {
            this.onAttack()
          }
        }, 1200)
      }
    }
  }
}
</script>
