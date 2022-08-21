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
    @spell="onSpell"
    @defence="onDefence"
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

const COLORS = {
  GREEN: '#51AE5A',
  RED: '#F1493D',
  ORANGE: '#FD9A30'
}

import { getPlayerFullStats } from '@/utils/helpers'

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
      messages: [],
      playerFullStats: {}
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
        this.playerStatus.heal_remains > 0
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

  async created() {
    console.log('Battle:created')

    if (this.$route.params.NFTId) {
      this.NFTId = Number.parseInt(this.$route.params.NFTId)

      this.battle = createBattle(this.player.id, this.NFTId)

      this.shuffleMonsters()

      this.playAudio(SOUND_EFFECT.ENCOUNTER)

      setTimeout(async () => {
        this.game = createGame(this.battle)

        const { exp, win, lose } = this.player
        this.playerFullStats = getPlayerFullStats({ exp, win, lose })
        await this.addPlayerStatsMessages(this.player, this.playerFullStats)

        await this.addGameStartMessages()

        setTimeout(() => {
          this.playAudio(MUSIC.BATTLE)
        }, 500)

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

    isPlayer(player) {
      return player.id === this.player.id
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

    async onContinue() {
      console.log('onContinue')

      this.stopAudio(MUSIC.BATTLE)

      this.shuffleMonsters()

      this.playAudio(SOUND_EFFECT.ENCOUNTER)

      this.game = null
      this.gameAborting = false
      this.gameAborted = false
      this.gameFinished = false
      this.messages = []

      setTimeout(async () => {
        this.game = createGame(this.battle)

        const { exp, win, lose } = this.player
        this.playerFullStats = getPlayerFullStats({ exp, win, lose })
        await this.addPlayerStatsMessages(this.player, this.playerFullStats)

        await this.addGameStartMessages()

        setTimeout(() => {
          this.playAudio(MUSIC.BATTLE)
        }, 500)

        if (this.game && this.game.current_player === 2) {
          setTimeout(() => {
            this.onAttack()
          }, 1500)
        }
      }, 3000)
    },

    async onGameUpdate(move) {
      this.game.moves.push(move)

      await this.addGameMessages(this.game)

      if (this.gameAborting || this.gameAborted || this.gameFinished) return

      const nextPlayer = this.game.current_player === 1 ? 2 : 1

      this.game.current_player = nextPlayer
      this.game.turn++

      if (this.game.current_player === 2) {
        setTimeout(() => {
          if (
            this.currentPlayerStatus.hp < 30 &&
            this.currentOpponentStatus.hp > 25 &&
            this.currentPlayerStatus.heal_remains > 0
          ) {
            this.onHeal()
          } else if (
            this.currentPlayerStatus.spell_remains > 0 &&
            this.currentOpponentStatus.isDefence
          ) {
            this.onSpell()
          } else if (this.currentPlayerStatus.attack_remains === 0) {
            this.onDefence()
          } else {
            this.onAttack()
          }
        }, 1200)
      }
    },

    async onAttack() {
      console.log('onAttack')

      if (this.currentPlayerStatus.attack_remains <= 0) {
        throw new Error('Failed to move: Can not use attack')
      }

      const move = {
        playerKey: this.currentPlayerKey,
        move: PLAYER_MOVE.ATTACK,
        payload: {
          damage: 0,
          isMiss: false,
          isCritical: false,
          isMustCritical: false,
          isFinish: false,
          isOpponentDefence: this.currentOpponentStatus.isDefence
        }
      }

      const nextPlayerStatus = {}
      const nextOpponentStatus = {}

      let damage = 0
      let isMiss = false
      let isCritical = false
      let isMustCritical = false
      let isFinish = false

      if (
        !this.currentPlayerStatus.mustCritical &&
        Math.random() < this.currentPlayerStatus.missRate
      ) {
        isMiss = true
      } else {
        damage = Math.floor(
          (this.currentPlayerStatus.attack * 100) /
            (100 + this.currentOpponentStatus.defense)
        )

        if (
          !this.currentPlayerStatus.mustCritical &&
          this.currentOpponentStatus.isDefence
        ) {
          damage = Math.floor(damage * 0.7)
        }

        if (this.currentPlayerStatus.mustCritical) {
          isMustCritical = true
          damage = Math.floor(damage * 1.5)
          nextPlayerStatus.mustCritical = false
        } else if (Math.random() < this.currentPlayerStatus.criticalRate) {
          isCritical = true
          damage = Math.floor(damage * 1.5)
        } else {
          const adjustDamage = getRandomValue(-2, 2)
          damage = damage + adjustDamage
        }
      }

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
        isFinish = true
      } else {
        if (oldOpponentHpRate >= 0.25 && newOpponentHpRate < 0.25) {
          nextOpponentStatus.criticalRate = 0.15
        } else if (oldOpponentHpRate >= 0.05 && newOpponentHpRate < 0.05) {
          nextOpponentStatus.criticalRate = 0.25
        }
      }

      move.payload.damage = damage
      move.payload.isMiss = isMiss
      move.payload.isCritical = isCritical
      move.payload.isMustCritical = isMustCritical
      move.payload.isFinish = isFinish

      nextPlayerStatus.attack_remains =
        this.currentPlayerStatus.attack_remains - 1

      if (this.currentOpponentStatus.isDefence) {
        nextOpponentStatus.isDefence = false
      }

      this.game.players[this.currentPlayerKey] = {
        ...this.game.players[this.currentPlayerKey],
        ...nextPlayerStatus
      }

      this.game.players[this.currentOpponentKey] = {
        ...this.game.players[this.currentOpponentKey],
        ...nextOpponentStatus
      }

      await this.onGameUpdate(move)
    },

    async onSpell() {
      console.log('onSpell')

      if (this.currentPlayerStatus.spell_remains <= 0) {
        throw new Error('Failed to move: Can not use spell')
      }

      const move = {
        playerKey: this.currentPlayerKey,
        move: PLAYER_MOVE.SPELL,
        payload: {
          damage: 0,
          isFinish: false,
          isOpponentDefence: this.currentOpponentStatus.isDefence
        }
      }

      const nextPlayerStatus = {}
      const nextOpponentStatus = {}

      let damage = 0
      let isFinish = false

      damage = Math.floor(
        (this.currentPlayerStatus.int * 100) /
          (100 + this.currentOpponentStatus.defense)
      )

      let nextOpponentHp = this.currentOpponentStatus.hp - damage

      if (nextOpponentHp < 0) {
        nextOpponentHp = 0
      }

      nextOpponentStatus.hp = nextOpponentHp

      if (nextOpponentHp === 0) {
        isFinish = true
      }

      move.payload.isFinish = isFinish
      move.payload.damage = damage

      nextPlayerStatus.spell_remains =
        this.currentPlayerStatus.spell_remains - 1

      if (this.currentOpponentStatus.isDefence) {
        nextOpponentStatus.isDefence = false
      }

      this.game.players[this.currentPlayerKey] = {
        ...this.game.players[this.currentPlayerKey],
        ...nextPlayerStatus
      }

      this.game.players[this.currentOpponentKey] = {
        ...this.game.players[this.currentOpponentKey],
        ...nextOpponentStatus
      }

      await this.onGameUpdate(move)
    },

    async onDefence() {
      console.log('onDefence')

      const move = {
        playerKey: this.currentPlayerKey,
        move: PLAYER_MOVE.DEFENCE,
        payload: {
          recoveryAmount: 0,
          mustCritical: false
        }
      }

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

      move.payload.recoveryAmount = recoveryAmount
      move.payload.mustCritical = mustCritical

      nextPlayerStatus.attack_remains =
        this.currentPlayerStatus.attack_remains + recoveryAmount
      nextPlayerStatus.mustCritical = mustCritical
      nextPlayerStatus.isDefence = true

      if (this.currentOpponentStatus.isDefence) {
        nextOpponentStatus.isDefence = false
      }

      this.game.players[this.currentPlayerKey] = {
        ...this.game.players[this.currentPlayerKey],
        ...nextPlayerStatus
      }

      this.game.players[this.currentOpponentKey] = {
        ...this.game.players[this.currentOpponentKey],
        ...nextOpponentStatus
      }

      await this.onGameUpdate(move)
    },

    async onHeal() {
      console.log('onHeal')

      if (this.currentPlayerStatus.heal_remains <= 0) {
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

      const oldPlayerHp = this.currentPlayerStatus.hp

      let newPlayerHp = oldPlayerHp + recoveryAmount

      if (newPlayerHp > this.currentPlayerStatus.max_hp) {
        newPlayerHp = this.currentPlayerStatus.max_hp
      }

      move.payload.recoveryAmount = recoveryAmount

      nextPlayerStatus.hp = newPlayerHp
      nextPlayerStatus.heal_remains = this.currentPlayerStatus.heal_remains - 1

      if (this.currentOpponentStatus.isDefence) {
        nextOpponentStatus.isDefence = false
      }

      this.game.players[this.currentPlayerKey] = {
        ...this.game.players[this.currentPlayerKey],
        ...nextPlayerStatus
      }

      this.game.players[this.currentOpponentKey] = {
        ...this.game.players[this.currentOpponentKey],
        ...nextOpponentStatus
      }

      await this.onGameUpdate(move)
    },

    addMessage(line) {
      this.messages.push(line)
    },

    async wait(milliseconds) {
      return await new Promise(resolve => setTimeout(resolve, milliseconds))
    },

    async addGameStartMessages() {
      this.addMessage({
        words: [
          {
            text: 'バトルスタート！'
          }
        ]
      })
    },

    async addPlayerStatsMessages(player, playerFullStats) {
      // eslint-disable-next-line no-unused-vars
      const { exp, win, lose, totalMatch, winRate } = playerFullStats

      if (totalMatch < 0) {
        this.addMessage({
          words: [
            {
              text: `[${player.name}] の初バトル！`
            }
          ]
        })
      } else {
        this.addMessage({
          words: [
            {
              text: player.name
            },
            {
              text: '経験値'
            },
            {
              text: exp
            }
          ]
        })

        this.addMessage({
          words: [
            {
              text: `勝率 ${winRate}% (勝ち ${win} + 負け ${lose} = 合計 ${totalMatch})`
            }
          ]
        })
      }
    },

    async addGameMessages(game) {
      if (game.moves.length > 0) {
        const lastMove = game.moves[game.moves.length - 1]

        let player, opponentPlayer
        let playerNFT, opponentPlayerNFT

        let isGameFinish = false

        if (lastMove.playerKey === 1) {
          const playerId = game.players[1].id
          player = this.findPlayer(playerId)
          opponentPlayer = CPU
          playerNFT = this.NFT1
          opponentPlayerNFT = this.NFT2
        } else {
          const playerId = game.players[1].id
          player = CPU
          opponentPlayer = this.findPlayer(playerId)
          playerNFT = this.NFT2
          // eslint-disable-next-line no-unused-vars
          opponentPlayerNFT = this.NFT1
        }

        if (lastMove.move === PLAYER_MOVE.ATTACK) {
          const {
            damage,
            isMiss,
            isCritical,
            isMustCritical,
            isFinish,
            isOpponentDefence
          } = {
            ...lastMove.payload
          }

          this.addMessage({
            words: [
              {
                text: `${player.name} の攻撃！`
              }
            ]
          })

          await this.playAudio(SOUND_EFFECT.ATTACK)

          if (isMiss) {
            this.addMessage({
              words: [
                {
                  text: 'ミス！'
                }
              ]
            })
          } else {
            if (isMustCritical) {
              this.addMessage({
                words: [
                  {
                    text: 'クリティカルヒット！',
                    style: `color: ${COLORS.ORANGE};`
                  }
                ]
              })

              if (isOpponentDefence) {
                this.addMessage({
                  words: [
                    {
                      text: `${opponentPlayer.name} の防御を突き抜けた！`
                    }
                  ]
                })
              }

              await this.playAudio(SOUND_EFFECT.ATTACK_CRITICAL)
            } else if (isCritical) {
              this.addMessage({
                words: [
                  {
                    text: 'クリティカルヒット！',
                    style: `color: ${COLORS.ORANGE};`
                  }
                ]
              })

              await this.playAudio(SOUND_EFFECT.ATTACK_CRITICAL)
            }
          }

          await this.addTakeDamageMessages(damage, player, opponentPlayer)

          isGameFinish = isFinish
        } else if (lastMove.move === PLAYER_MOVE.SPELL) {
          const { damage, isFinish, isOpponentDefence } = {
            ...lastMove.payload
          }

          const spellLabel = this.$filters.spellLabel(playerNFT)
          this.addMessage({
            words: [
              {
                text: `${player.name} の${spellLabel}攻撃！`
              }
            ]
          })

          await this.playAudio(SOUND_EFFECT.SPELL)

          if (damage > 0) {
            if (isOpponentDefence) {
              this.addMessage({
                words: [
                  {
                    text: `${opponentPlayer.name} の防御を突き抜けた！`
                  }
                ]
              })
            }
          }

          await this.addTakeDamageMessages(damage, player, opponentPlayer)

          isGameFinish = isFinish
        } else if (lastMove.move === PLAYER_MOVE.DEFENCE) {
          const { recoveryAmount, mustCritical } = {
            ...lastMove.payload
          }

          this.addMessage({
            words: [
              {
                text: `${player.name} は防御態勢を取って力をためている・・・！`
              }
            ]
          })

          await this.playAudio(SOUND_EFFECT.DEFENCE)

          if (recoveryAmount > 0) {
            this.addMessage({
              words: [
                {
                  text: `${player.name} の攻撃回数が`
                },
                {
                  text: recoveryAmount,
                  style: `color: ${COLORS.GREEN};`
                },
                {
                  text: '増えた！'
                }
              ]
            })
          }

          if (mustCritical) {
            this.addMessage({
              words: [
                {
                  text: `${player.name} に力がみなぎってきた！`
                }
              ]
            })

            this.addMessage({
              words: [
                {
                  text: `${player.name} の`
                },
                {
                  text: '次ターンの攻撃は必ずクリティカルヒット',
                  style: `color: ${COLORS.ORANGE}`
                },
                {
                  text: 'になる予感・・・！'
                }
              ]
            })
          }

          this.addMessage({
            words: [
              {
                text: `${player.name} は攻撃に備えて防御を続けている！`
              }
            ]
          })
        } else if (lastMove.move === PLAYER_MOVE.HEAL) {
          const { recoveryAmount } = {
            ...lastMove.payload
          }

          this.addMessage({
            words: [
              {
                text: `${player.name} の回復！`
              }
            ]
          })

          if (recoveryAmount === 0) {
            this.addMessage({
              words: [
                {
                  text: 'ミス',
                  style: `color: ${COLORS.RED}`
                }
              ]
            })
            this.addMessage({
              words: [
                {
                  text: `${player.name} は HP を回復できなかった！`
                }
              ]
            })
          } else {
            this.addMessage({
              words: [
                {
                  text: `${player.name} の HP が`
                },
                {
                  text: recoveryAmount,
                  style: `color: ${COLORS.GREEN};`
                },
                {
                  text: '回復した！'
                }
              ]
            })

            await this.playAudio(SOUND_EFFECT.HEAL)
          }
        }

        if (isGameFinish) {
          await this.addGameFinishMessages(player, opponentPlayer)
        }
      }
    },

    async addTakeDamageMessages(damage, attacker, defender) {
      if (damage > 0) {
        if (this.isPlayer(attacker)) {
          this.addMessage({
            words: [
              {
                text: `${defender.name} に`
              },
              {
                text: damage,
                style: `color: ${COLORS.ORANGE}`
              },
              {
                text: 'のダメージを与えた！'
              }
            ]
          })
        } else {
          this.addMessage({
            words: [
              {
                text: `${defender.name} は`
              },
              {
                text: damage,
                style: `color: ${COLORS.RED}`
              },
              {
                text: 'のダメージを受けた！'
              }
            ]
          })
        }
      } else {
        let text = this.isPlayer(attacker)
          ? `${defender.name} にダメージを与えられなかった`
          : `${defender.name} はダメージを受けなかった！`

        this.addMessage({
          words: [
            {
              text
            }
          ]
        })
      }
    },

    async addGameFinishMessages(winner, loser) {
      this.addMessage({
        words: [
          {
            text: `${loser.name} は気絶してしまった！`
          }
        ]
      })

      this.addMessage({
        words: [
          {
            text: `${winner.name} の勝利！`
          }
        ]
      })

      let addExp = 0
      let addWin = 0
      let addLose = 0

      if (this.isPlayer(winner)) {
        // player wins
        addExp = 3
        addWin = 1
        addLose = 0

        this.playAudio(SOUND_EFFECT.WIN)
      } else {
        // playe lose
        addExp = 1
        addWin = 0
        addLose = 1

        this.playAudio(SOUND_EFFECT.LOSE)
      }

      this.addMessage({
        words: [
          {
            text: addExp,
            style: `color: ${COLORS.GREEN}`
          },
          {
            text: 'ポイントの経験値を得た！'
          }
        ]
      })

      const { exp: oldExp, win: oldWin, lose: oldLose } = this.playerFullStats

      const newPlayerStats = {
        ...oldExp,
        ...{
          exp: oldExp + addExp,
          win: oldWin + addWin,
          lose: oldLose + addLose
        }
      }

      const { exp, win, lose } = newPlayerStats
      this.playerFullStats = getPlayerFullStats({ exp, win, lose })
      this.addPlayerStatsMessages(this.player, this.playerFullStats)

      this.$nextTick(() => {
        this.$socket.emit('player:updateStats', {
          exp: addExp,
          win: addWin,
          lose: addLose
        })
      })
    }
  }
}
</script>
