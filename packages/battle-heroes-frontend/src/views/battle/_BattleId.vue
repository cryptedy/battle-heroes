<template>
  <ErrorScreen v-if="gameError" message="エラーが発生しました">
    <BaseButton type="primary" @click="reload"> リロード </BaseButton>
  </ErrorScreen>

  <ErrorScreen v-else-if="!battle" message="バトルが見つかりません">
    <p>
      すでにバトルが終了したかプレイヤーにより中止・辞退された可能性があります。
    </p>
    <p style="margin-top: 16px">
      <BaseButton type="primary" @click="leaveBattle">
        <FontAwesomeIcon icon="arrow-left" />
        戻る
      </BaseButton>
    </p>
  </ErrorScreen>

  <template v-else>
    <ErrorScreen
      v-if="isBattleEnded && !cachedBattle"
      message="バトルが見つかりません"
    >
      <p>
        すでにバトルが終了したかプレイヤーにより中止・辞退された可能性があります。
      </p>
      <p style="margin-top: 16px">
        <BaseButton type="primary" @click="leaveBattle">
          <FontAwesomeIcon icon="arrow-left" />
          戻る
        </BaseButton>
      </p>
    </ErrorScreen>

    <SplashScreen
      v-else-if="isSpectator && !gameStarted"
      message="バトルを読み込んでいます"
    >
      <p>読み込みが完了するとバトル観戦がはじまります。</p>
      <p style="margin-top: 16px">
        <BaseButton type="primary" @click="leaveBattle">
          <FontAwesomeIcon icon="arrow-left" />
          戻る
        </BaseButton>
      </p>
    </SplashScreen>

    <SplashScreen
      v-else-if="!isSpectator && (isWaitingForOpponent || !game)"
      :message="
        isBattleRushed ? '新しい挑戦者の予感...' : '対戦相手を探しています...'
      "
    >
      <template v-if="!isBattleRushed">
        <p style="font-size: 120%">{{ player.name }}</p>
        <p style="font-size: 120%">{{ playerNFT.name }}</p>
        <div style="margin: 16px auto; max-width: 150px">
          <NFTImage :nft="playerNFT" />
        </div>

        <p style="margin-top: 16px">
          <BaseButton
            v-if="canDeleteBattle"
            type="danger"
            @click="onDeleteBattle"
          >
            <FontAwesomeIcon icon="arrow-left" />
            やめる
          </BaseButton>
        </p>
      </template>
    </SplashScreen>

    <template v-else-if="game">
      <BattleSplashScreen
        v-if="gamePreparing"
        :type="splashScreenType"
        :player="player"
        :player-nft="playerNFT"
        :opponent-nft="opponentNFT"
        :opponent-player="opponentPlayer"
      />

      <Battle
        v-else
        :battle="battle"
        :game="game"
        :messages="messages"
        :cpu-battle="isCPUBattle"
        :playable="playable"
        :spectate="isSpectator"
        :finished="gameFinished"
        :aborted="gameAborted"
        :player-key="playerKey"
        :player="player"
        :player-nft="playerNFT"
        :opponent-player-key="opponentPlayerKey"
        :opponent-player="opponentPlayer"
        :opponent-nft="opponentNFT"
        @attack="onAttack"
        @spell="onSpell"
        @defence="onDefence"
        @heal="onHeal"
        @move-cpu="onMoveCPU"
        @leave="onGameLeave"
        @finish="onGameFinished"
        @abort="onGameAbort"
        @continue="onBattleContinued"
        @online-status="onOnlineStatusChanged"
      />
    </template>

    <SplashScreen v-else />
  </template>
</template>

<script>
import Battle from '@/components/Battle'
import NFTImage from '@/components/NFTImage'
import { mapGetters, mapActions } from 'vuex'
import ErrorScreen from '@/components/ErrorScreen'
import { getPlayerFullStats } from '@/utils/helpers'
import SplashScreen from '@/components/SplashScreen'
import BattleSplashScreen from '@/components/BattleSplashScreen'
import {
  MUSIC,
  SOUND_EFFECT,
  PLAYER_MOVE,
  BATTLE_TYPE,
  BATTLE_STATE,
  PLAYER_STATE,
  NOTIFICATION_TYPE,
  NOTIFICATION_TIMEOUT,
  BATTLE_SPLASH_SCREEN_TYPE
} from '@/utils/constants'

const COLOR = {
  BLUE: '#6ec6ff',
  RED: '#ff7961',
  GREEN: '#80e27e',
  YELLOW: '#ffff72',
  ORANGE: '#ffc947'
}

const isGameActivated = game =>
  game &&
  !Object.keys(game.players).some(
    playerKey => !game.players[playerKey].is_activated
  )

export default {
  name: 'BattleView',

  components: {
    Battle,
    NFTImage,
    ErrorScreen,
    SplashScreen,
    BattleSplashScreen
  },

  // eslint-disable-next-line no-unused-vars
  async beforeRouteLeave(to, from, next) {
    if (this.canLeaveBattle) {
      next()
    } else {
      try {
        await this.showPreventLeaveDialog()

        next()
      } catch (error) {
        next(false)
      }
    }
  },

  data() {
    return {
      retryActivate: 30,
      cachedBattle: null,
      playable: false,
      rushed: false,
      game: null,
      gamePreparing: false,
      gameStarted: false,
      gameAborting: false,
      gameAborted: false,
      gameFinished: false,
      gameError: false,
      gameIntervalId: null,
      splashScreenType: BATTLE_SPLASH_SCREEN_TYPE.LOADING,
      playerFullStats: {},
      messages: [],
      hasNextBattle: false
    }
  },

  computed: {
    ...mapGetters({
      findNFT: 'NFT/find',
      findBattle: 'battle/find',
      findPlayer: 'player/find',
      gamePlayer: 'game/player',
      playerBattle: 'game/playerBattle'
    }),

    actualBattle() {
      return this.findBattle(this.$route.params.battleId)
    },

    battle() {
      return this.actualBattle || this.cachedBattle
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

    isBattleRushed() {
      return this.splashScreenType === BATTLE_SPLASH_SCREEN_TYPE.RUSHING
    },

    isCPUBattle() {
      return this.battle.type === BATTLE_TYPE.CPU
    },

    isPlayerBattle() {
      return this.playerBattle && this.playerBattle.id === this.battle.id
    },

    isSpectator() {
      return !this.isPlayerBattle
    },

    isWaitingForOpponent() {
      return (
        this.gamePlayer.state === PLAYER_STATE.STANDBY ||
        (this.playerBattle && this.playerBattle.state === BATTLE_STATE.READY)
      )
    },

    isPreparingGame() {
      return !this.game && !this.isWaitingForOpponent
    },

    canStartBattle() {
      return (
        this.actualBattle &&
        this.isPlayerBattle &&
        (this.isBattleStarted || this.isBattleReady)
      )
    },

    canDeleteBattle() {
      return this.playerBattle && this.isPlayerBattle
    },

    canLeaveBattle() {
      return (
        !this.battle ||
        !this.game ||
        this.gameAborted ||
        this.gameAborting ||
        this.gameFinished ||
        this.isSpectator
      )
    },

    players() {
      return this.battle.players
    },

    player1() {
      return this.findPlayer(this.players[1].id)
    },

    player2() {
      return this.findPlayer(this.players[2].id)
    },

    NFT1() {
      return this.findNFT(this.players[1].NFT_id)
    },

    NFT2() {
      return this.findNFT(this.players[2].NFT_id)
    },

    playerKey() {
      if (!this.gamePlayer) return 1
      if (this.gamePlayer.id === this.player1.id) return 1
      if (this.gamePlayer.id === this.player2.id) return 2
      return 1
    },

    opponentPlayerKey() {
      return this.playerKey === 1 ? 2 : 1
    },

    player() {
      return this.playerKey === 1 ? this.player1 : this.player2
    },

    playerNFT() {
      return this.playerKey === 1 ? this.NFT1 : this.NFT2
    },

    opponentPlayer() {
      return this.playerKey === 1 ? this.player2 : this.player1
    },

    opponentNFT() {
      return this.opponentPlayerKey === 1 ? this.NFT1 : this.NFT2
    }
  },

  async created() {
    console.log('Battle:created')

    this.$socket.on('battle:matched', payload => this.onBattleMatched(payload))
    this.$socket.on('battle:rushed', payload => this.onBattleRushed(payload))
    this.$socket.on('battle:next', payload => this.onNextBattleCreated(payload))
    this.$socket.on('game:aborted', gameId => this.onGameAborted(gameId))

    this.splashScreenType =
      this.$route.params.splashScreenType || BATTLE_SPLASH_SCREEN_TYPE.LOADING
  },

  async mounted() {
    console.log('Battle:mounted')

    if (!this.battle) return

    if (this.isSpectator) {
      this.loadGame()
    } else if (this.canStartBattle) {
      this.startGame()
    }
  },

  beforeUnmount() {
    console.log('Battle:beforeUnmount')

    this.$socket.off('game:update')
    this.$socket.off('game:aborted')
    this.$socket.off('battle:matched')
    this.$socket.off('battle:rushed')
    this.$socket.off('battle:next')

    this.stopAudio(MUSIC.BATTLE)

    this.clearWaitNextMove()
  },

  methods: {
    ...mapActions({
      playAudio: 'audio/play',
      stopAudio: 'audio/stop',
      addBattle: 'battle/add',
      deleteBattle: 'battle/delete',
      removeBattle: 'battle/remove',
      updateBattle: 'battle/update',
      updatePlayer: 'player/update',
      addNotification: 'notification/add'
    }),

    reload() {
      location.reload()
    },

    isPlayer(player) {
      return player.id === this.player.id
    },

    async wait(milliseconds) {
      return await new Promise(resolve => setTimeout(resolve, milliseconds))
    },

    onOnlineStatusChanged(player, isOnline) {
      this.addOnlineStatusMessages(player, isOnline)
    },

    onBattleContinued(player, opponentPlayer, currentBattle, nextBattleId) {
      console.log(
        'onBattleContinued',
        player,
        opponentPlayer,
        currentBattle,
        nextBattleId
      )

      try {
        this.$socket.emit(
          'battle:continue',
          opponentPlayer.id,
          currentBattle.id,
          nextBattleId
        )
      } catch (error) {
        console.log(error)
      }
    },

    onNextBattleCreated({
      opponentPlayerId,
      playerId,
      previousBattleId,
      nexBattleId
    }) {
      console.log(
        'onNextBattleCreated',
        opponentPlayerId,
        playerId,
        previousBattleId,
        nexBattleId
      )

      this.addNextBattleMessages()
    },

    leaveBattle() {
      console.log('leaveBattle')

      return this.$router.push(
        {
          name: 'arena',
          replace: true
        },
        () => {}
      )
    },

    async onDeleteBattle() {
      if (this.battle) {
        await this.deleteBattle(this.battle.id)
      }

      this.leaveBattle()
    },

    showPreventLeaveDialog() {
      return new Promise((resolve, reject) => {
        this.$dialog.open({
          title: 'バトルを終了しますか？',
          message: `
            <p>対戦中にバトルを抜けるとバトルは削除されます。</p>
          `,
          dismissable: false,
          confirmLabel: 'バトルを終了',
          cancelLabel: 'バトルに戻る',
          onConfirm: () => {
            this.gameAborting = true

            this.$socket.emit(
              'game:abort',
              this.game.id,
              // eslint-disable-next-line no-unused-vars
              ({ status, message, gameId }) => {
                this.leaveBattle().then(() => {
                  this.gameAborting = false
                })
              }
            )
          },
          onCancel: () => reject()
        })
      })
    },

    startGame() {
      console.log('startGame')
      this.$socket.emit('game:start', this.battle.id, this.onGameStarted)
    },

    loadGame() {
      console.log('loadGame')
      this.$socket.emit('game:load', this.battle.id, this.onGameStarted)
    },

    onBattleMatched({ status, message, battle, player1, player2 }) {
      console.log('onBattleMatched', status, message, battle, player1, player2)

      if (status) {
        this.updatePlayer(player1)
        this.updatePlayer(player2)
        this.updateBattle(battle)

        this.startGame()
      } else {
        this.addNotification({
          message,
          type: NOTIFICATION_TYPE.ERROR,
          timeout: 0
        })
      }
    },

    onBattleRushed({ status, message, battle, player1, player2 }) {
      console.log('onBattleRushed', status, message, battle, player1, player2)

      if (status) {
        this.addBattle(battle)
        this.updatePlayer(player1)
        this.updatePlayer(player2)
        // delete old battle
        this.removeBattle(this.battle.id)

        this.$router.push(
          {
            name: 'battles.show',
            params: {
              battleId: battle.id,
              splashScreenType: BATTLE_SPLASH_SCREEN_TYPE.RUSHING
            }
          },
          () => {}
        )
      } else {
        this.addNotification({
          message,
          type: NOTIFICATION_TYPE.ERROR,
          timeout: 0
        })
      }
    },

    async onGameStarted({ status, message, game }) {
      console.log('onGameStarted', status, message, game)

      this.$socket.off('game:updated')

      if (status) {
        this.gamePreparing = true

        const waitActivate = async () => {
          return new Promise((resolve, reject) => {
            let intervalId = setTimeout(() => {
              if (isGameActivated(game)) {
                console.log('player: game activated')

                clearInterval(intervalId)
                resolve()
              } else {
                console.log('player: game not activated')

                if (this.retryActivate <= 0) return reject()

                this.retryActivate--

                console.log(
                  `player: check is game activated ${this.retryActivate} times...`
                )

                this.loadGame()
              }
            }, 1000)
          })
        }

        // eslint-disable-next-line no-unused-vars
        await waitActivate().catch(error => {
          this.gameError = true
        })

        this.cachedBattle = this.battle

        this.game = game

        this.$socket.on('game:updated', this.onGameUpdated)

        if (this.isPlayerBattle) {
          this.playable = true
        }

        let splashScreenTimeout = 0

        if (!this.isSpectator) {
          this.playAudio(SOUND_EFFECT.ENCOUNTER)
          splashScreenTimeout = 4000
        }

        setTimeout(async () => {
          this.gamePreparing = false
          this.gameStarted = true

          if (this.playable) {
            this.playerFullStats = getPlayerFullStats({
              exp: this.player.exp,
              win: this.player.win,
              lose: this.player.lose
            })

            await this.addPlayerStatsMessages(this.player, this.playerFullStats)

            const opponetPlayerFullStats = getPlayerFullStats({
              exp: this.opponentPlayer.exp,
              win: this.opponentPlayer.win,
              lose: this.opponentPlayer.lose
            })

            await this.addPlayerStatsMessages(
              this.opponentPlayer,
              opponetPlayerFullStats
            )
          }

          if (this.isSpectator) {
            this.addGameMessagesForSpectators()
          } else {
            if (game.moves.length > 0) {
              await this.addGameResumeMessages()
            } else {
              await this.addGameStartMessages()
            }
          }

          const { player } = this.getGameContext(game, game.current_player)

          this.waitNextMove(player)

          setTimeout(() => {
            this.stopAudio(SOUND_EFFECT.ENCOUNTER)
            this.playAudio(MUSIC.BATTLE)
          }, 500)
        }, splashScreenTimeout)
      } else {
        if (this.isSpectator) {
          const waitActivate = async () => {
            return new Promise((resolve, reject) => {
              let intervalId = setTimeout(() => {
                if (isGameActivated(game)) {
                  console.log('spectator: game activated')

                  clearInterval(intervalId)
                  resolve()
                } else {
                  console.log('spectator: game not activated')

                  console.log(
                    `spectator: check is game activated ${this.retryActivate} times...`
                  )

                  if (this.retryActivate <= 0) return reject()

                  this.retryActivate--

                  this.loadGame()
                }
              }, 1000)
            })
          }

          // eslint-disable-next-line no-unused-vars
          await waitActivate().catch(error => {
            this.gameError = true
          })
        }

        this.addNotification({
          message,
          type: NOTIFICATION_TYPE.ERROR,
          timeout: 0
        })
      }
    },

    async onGameUpdated(game) {
      console.log('onGameUpdated', game)

      if (game.id !== this.game.id) return

      await this.addGameMessages(game)

      this.game = game
    },

    onGameLeave() {
      console.log('onGameLeave')

      this.leaveBattle()
    },

    onGameAbort() {
      console.log('onGameAbort')

      this.leaveBattle()
    },

    onGameAborted(gameId) {
      console.log('onGameAborted', gameId)

      if (gameId === this.game.id) {
        this.gameAborted = true

        this.$socket.off('game:updated')

        this.clearWaitNextMove()

        this.stopAudio(MUSIC.BATTLE)

        this.addGameAbortedMessages(this.isSpectator)
      }
    },

    onGameFinished() {
      console.log('onGameFinished')

      this.gameFinished = true

      this.$socket.off('game:updated')

      this.clearWaitNextMove()

      this.stopAudio(MUSIC.BATTLE)

      this.$socket.emit('game:finish', this.game.id)
    },

    onMoveCPU() {
      console.log('onMoveCPU')

      this.$socket.emit('game:moveCPU')
    },

    onAttack() {
      console.log('onAttack')

      this.$socket.emit('game:move', PLAYER_MOVE.ATTACK)
    },

    onSpell() {
      console.log('onSpell')

      this.$socket.emit('game:move', PLAYER_MOVE.SPELL)
    },

    onDefence() {
      console.log('onDefence')

      this.$socket.emit('game:move', PLAYER_MOVE.DEFENCE)
    },

    onHeal() {
      console.log('onHeal')

      this.$socket.emit('game:move', PLAYER_MOVE.HEAL)
    },

    waitNextMove(player) {
      this.clearWaitNextMove()

      console.log('waitNextMove')
      this.gameIntervalId = setTimeout(() => {
        if (this.gameAborted || this.gameFinished) return

        this.addNoNextMoveMessages(player)
      }, 30000)
    },

    clearWaitNextMove() {
      console.log('clearWaitNextMove')
      if (this.gameIntervalId) {
        clearInterval(this.gameIntervalId)
      }
    },

    getGameContext(game, playerKey) {
      const opponentPlayerKey = playerKey === 1 ? 2 : 1

      const player = this.findPlayer(game.players[playerKey].id)
      const playerNFT = this.findNFT(game.players[playerKey].NFT_id)

      const opponentPlayer = this.findPlayer(game.players[opponentPlayerKey].id)
      const opponentNFT = this.findNFT(game.players[opponentPlayerKey].NFT_id)

      return {
        playerKey,
        player,
        playerNFT,
        opponentPlayerKey,
        opponentPlayer,
        opponentNFT
      }
    },

    addMessage(line) {
      this.messages.push(line)
    },

    async addGameStartMessages() {
      this.addMessage({
        words: [
          {
            text: '=== バトルスタート！ ==='
          }
        ]
      })
    },

    async addGameResumeMessages() {
      this.addMessage({
        words: [
          {
            text: '=== バトル再開！ ==='
          }
        ]
      })
    },

    async addGameMessagesForSpectators() {
      this.addMessage({
        words: [
          {
            text: '=== バトル観戦スタート！ ==='
          }
        ]
      })

      this.addMessage({
        style: `color: ${COLOR.YELLOW}`,
        words: [
          {
            text: `現在 ${this.game.turn} ターン目！`
          }
        ]
      })
    },

    addGameAbortedMessages(isSpectator) {
      const message = isSpectator
        ? 'プレイヤーによってバトルが中止されました'
        : '対戦相手がバトルを中止しました'

      if (this.gameStarted) {
        this.addMessage({
          style: `color: ${COLOR.RED}`,
          words: [
            {
              text: `=== ${message} ===`
            }
          ]
        })
      } else {
        this.addNotification({
          message,
          type: NOTIFICATION_TYPE.ERROR,
          timeout: 0
        })
      }
    },

    async addNextBattleMessages() {
      this.addMessage({
        style: `color: ${COLOR.YELLOW}`,
        words: [
          {
            text: '=== 相手プレイヤーが再戦希望中 ==='
          }
        ]
      })
      this.addMessage({
        words: [
          {
            text: '['
          },
          {
            style: `color: ${COLOR.BLUE}`,
            text: '続けてバトル'
          },
          {
            text: '] で再戦できる可能性があります'
          }
        ]
      })
    },

    addOnlineStatusMessages(player, isOnline) {
      const message = isOnline
        ? `${player.name} がオンラインになりました`
        : `${player.name} がオフラインになりました`

      if (this.gameStarted) {
        const color = isOnline ? COLOR.GREEN : COLOR.RED

        this.addMessage({
          style: `color: ${color}`,
          words: [
            {
              text: `=== ${message} ===`
            }
          ]
        })
      } else {
        const type = isOnline
          ? NOTIFICATION_TYPE.INFORMATION
          : NOTIFICATION_TYPE.ERROR
        const timeout = isOnline ? NOTIFICATION_TIMEOUT : 0

        this.addNotification({
          message,
          type,
          timeout
        })
      }
    },

    async addPlayerStatsMessages(player, playerFullStats) {
      const { exp, win, lose, totalMatch, winRate } = playerFullStats

      if (totalMatch < 0) {
        this.addMessage({
          style: `color: ${COLOR.YELLOW}`,
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
      if (!game.moves.length > 0) return

      const lastMove = game.moves[game.moves.length - 1]

      const { player, playerNFT, opponentPlayer } = this.getGameContext(
        game,
        lastMove.playerKey
      )

      let isGameFinish = false

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

        this.playAudio(SOUND_EFFECT.ATTACK)

        if (isMiss) {
          this.addMessage({
            words: [
              {
                text: 'ミス！'
              }
            ]
          })
        } else if (isMustCritical) {
          this.addMessage({
            words: [
              {
                text: 'クリティカルヒット！'
              }
            ]
          })

          this.playAudio(SOUND_EFFECT.ATTACK_CRITICAL)

          if (isOpponentDefence) {
            this.addMessage({
              words: [
                {
                  text: `${opponentPlayer.name} の防御を突き抜けた！`
                }
              ]
            })
          }
        } else if (isCritical) {
          this.addMessage({
            words: [
              {
                text: 'クリティカルヒット！'
              }
            ]
          })

          this.playAudio(SOUND_EFFECT.ATTACK_CRITICAL)
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

        this.playAudio(SOUND_EFFECT.SPELL)

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

        this.playAudio(SOUND_EFFECT.DEFENCE)

        if (recoveryAmount > 0) {
          this.addMessage({
            words: [
              {
                text: `${player.name} の攻撃回数が ${recoveryAmount} 増えた！`
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
                text: `${player.name} の次ターンの攻撃は必ずクリティカルヒットになる予感・・・！`
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
                text: 'ミス！'
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
                text: `${player.name} の HP が ${recoveryAmount} 回復した！`
              }
            ]
          })

          this.playAudio(SOUND_EFFECT.HEAL)
        }
      }

      if (isGameFinish) {
        await this.addGameFinishMessages(player, opponentPlayer)
      } else {
        this.waitNextMove(opponentPlayer)
      }
    },

    async addTakeDamageMessages(damage, attacker, defender) {
      if (damage > 0) {
        let text = this.isPlayer(attacker)
          ? `${defender.name} に ${damage} のダメージを与えた！`
          : `${defender.name} は ${damage} のダメージを受けた！`

        this.addMessage({
          words: [
            {
              text
            }
          ]
        })
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

      if (this.playable) {
        let addExp = 0
        let addWin = 0
        let addLose = 0

        if (this.isPlayer(winner)) {
          addExp = 3
          addWin = 1
          addLose = 0

          this.playAudio(SOUND_EFFECT.WIN)
        } else {
          addExp = 1
          addWin = 0
          addLose = 1

          this.playAudio(SOUND_EFFECT.LOSE)
        }

        this.addMessage({
          words: [
            {
              text: `${this.player.name} は ${addExp} ポイントの経験値を得た！`
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
        await this.addPlayerStatsMessages(this.player, this.playerFullStats)
      }
    },

    addNoNextMoveMessages(player) {
      const message = this.isPlayer(player)
        ? 'コマンドを選択してください'
        : '対戦相手の反応がありません'

      this.addMessage({
        style: `color: ${COLOR.YELLOW}`,
        words: [
          {
            text: message
          }
        ]
      })

      if (!this.isPlayer(player)) {
        this.addMessage({
          style: `color: ${COLOR.YELLOW}`,
          words: [
            {
              text: 'ページを読み込み直すと反映される場合があります'
            }
          ]
        })
      }
    }
  }
}
</script>
