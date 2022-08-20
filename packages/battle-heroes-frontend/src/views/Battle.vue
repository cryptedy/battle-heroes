<template>
  <ErrorScreen v-if="!battle" message="The battle not found">
    <p>The battle has already finished or aborted</p>
    <p style="margin-top: 16px">
      <BaseButton type="primary" @click="leaveBattle">
        <FontAwesomeIcon icon="arrow-left" />
        戻る
      </BaseButton>
    </p>
  </ErrorScreen>

  <template v-else>
    <template v-if="isBattleCreated">
      <p>The battle just created</p>
      <p>{{ player1.name }}'s {{ NFT1.name }}</p>
      <div>
        <img :src="NFT1.image_url" :alt="NFT1.name" width="64" height="64" />
      </div>

      <p v-if="isPlayerBattle">Waiting for join opponent...</p>

      <BattleJoinButton v-else-if="canJoinBattle" :battle="battle" />
    </template>

    <template v-if="isBattleReady || isBattleStarted || isBattleEnded">
      <template v-if="!game">
        <template v-if="actualBattle">
          <BattleSplashScreen
            v-if="isPlayerBattle && (isBattleStarted || isBattleReady)"
            :type="splash"
            :player1="player1"
            :player2="player2"
            :nft1="NFT1"
            :nft2="NFT2"
          />

          <ErrorScreen v-else message="The battle already started">
            <p>The battle has already started by the other players</p>
            <div style="text-align: center">
              <p>{{ player1.name }}'s {{ NFT1.name }}</p>
              <p>⚔️</p>
              <p>{{ player2.name }}'s {{ NFT2.name }}</p>
            </div>

            <p style="margin-top: 16px">
              <BaseButton type="primary" @click="leaveBattle">
                <FontAwesomeIcon icon="arrow-left" />
                戻る
              </BaseButton>
            </p>
          </ErrorScreen>
        </template>
      </template>

      <Game
        v-else
        :game="game"
        :messages="messages"
        :allow-continue="false"
        :aborted="gameAborted"
        :playable="playable"
        :player1="player1"
        :player2="player2"
        :nft1="NFT1"
        :nft2="NFT2"
        @attack="onAttack"
        @spell="onSpell"
        @heal="onHeal"
        @defence="onDefence"
        @finish="onGameFinished"
        @abort="onGameAbort"
        @continue="onContinue"
      />
    </template>
  </template>
</template>

<script>
import Game from '@/components/Game'
import { MUSIC, SOUND_EFFECT } from '@/utils/constants'
import { mapGetters, mapActions } from 'vuex'
import ErrorScreen from '@/components/ErrorScreen'
import { getPlayerFullStats } from '@/utils/helpers'
import BattleJoinButton from '@/components/BattleJoinButton'
import BattleSplashScreen from '@/components/BattleSplashScreen'
import { PLAYER_MOVE, BATTLE_STATE, NOTIFICATION_TYPE } from '@/utils/constants'

export default {
  name: 'Battle',

  components: {
    Game,
    ErrorScreen,
    BattleJoinButton,
    BattleSplashScreen
  },

  // eslint-disable-next-line no-unused-vars
  beforeRouteLeave(to, from) {
    if (!this.canLeaveBattle) {
      window.confirm('You cannot leave this page during the battle.')

      return false
    }
  },

  data() {
    return {
      cachedBattle: null,
      playable: false,
      game: null,
      gameAborting: false,
      gameAborted: false,
      gameFinished: false,
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
      return this.findBattle(this.$route.params.battleId)
    },

    battle() {
      return this.actualBattle || this.cachedBattle
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
      return this.playerBattle && this.playerBattle.id === this.battle.id
    },

    canStartBattle() {
      return (
        this.actualBattle &&
        this.isPlayerBattle &&
        (this.isBattleStarted || this.isBattleReady)
      )
    },

    canJoinBattle() {
      return !this.playerBattle && !this.isPlayerBattle && this.isBattleCreated
    },

    canLeaveBattle() {
      return (
        !this.battle ||
        !this.game ||
        this.gameAborted ||
        this.gameAborting ||
        this.gameFinished
      )
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
    }
  },

  created() {
    console.log('Battle:created')

    this.$socket.on('game:aborted', gameId => this.onGameAborted(gameId))

    this.splash = this.$route.params.splash || 'reload'
  },

  mounted() {
    console.log('Battle:mounted')

    if (this.canStartBattle) {
      this.$socket.emit('game:start', this.battle.id, this.onGameStart)
    } else if (this.battle) {
      this.$socket.emit('game:load', this.battle.id, this.onGameStart)
    }
  },

  beforeUnmount() {
    console.log('Battle:beforeUnmount')

    this.$socket.off('game:update')
    this.$socket.off('game:aborted')

    this.stopAudio(MUSIC.BATTLE)
  },

  methods: {
    ...mapActions({
      playAudio: 'audio/play',
      stopAudio: 'audio/stop',
      addNotification: 'notification/add'
    }),

    leaveBattle() {
      console.log('leaveBattle')

      return this.$router.push(
        {
          name: 'battles',
          replace: true
        },
        () => {}
      )
    },

    onGameStart({ status, message, game }) {
      console.log('onGameStart', status, message, game)

      if (status) {
        this.$socket.on('game:update', this.onGameUpdate)

        this.playAudio(SOUND_EFFECT.ENCOUNTER)

        const timeout = this.$splash === 'challenger' ? 4500 : 3000

        setTimeout(() => {
          this.cachedBattle = this.battle
          this.playable = this.isPlayerBattle

          this.game = game

          const playerKey = game.players[1].id === this.player.id ? 1 : 2
          const opponentPlayerKey = playerKey === 1 ? 2 : 1
          const opponentPlayer = this.findPlayer(
            game.players[opponentPlayerKey].id
          )

          this.playerFullStats = getPlayerFullStats({
            exp: this.player.exp,
            win: this.player.win,
            lose: this.player.lose
          })
          this.addPlayerStatsMessages(this.player, this.playerFullStats)

          this.messages.push('------------------')

          const opponetPlayerFullStats = getPlayerFullStats({
            exp: opponentPlayer.exp,
            win: opponentPlayer.win,
            lose: opponentPlayer.lose
          })
          this.addPlayerStatsMessages(opponentPlayer, opponetPlayerFullStats)

          this.messages.push('------------------')

          if (game.moves.length > 0) {
            this.messages.push('バトル再開！')
          } else {
            this.messages.push('バトルスタート！')
          }

          setTimeout(() => {
            this.playAudio(MUSIC.BATTLE)
          }, 500)
        }, timeout)
      } else {
        this.addNotification({
          message,
          type: NOTIFICATION_TYPE.ERROR,
          timeout: 0
        })
      }
    },

    async onGameUpdate(game) {
      console.log('onGameUpdate', game)

      if (game.id !== this.game.id) {
        this.messages.push('ゲームエラーが発生しました')

        return
      }

      this.game = game

      await this.addGameMessages(game)
    },

    onGameAbort() {
      console.log('onGameAbort')

      this.gameAborting = true

      // eslint-disable-next-line no-unused-vars
      this.$socket.emit('game:abort', this.game.id, ({ status }) => {
        this.leaveBattle().then(() => {
          this.gameAborting = false
        })
      })
    },

    onGameAborted(gameId) {
      console.log('onGameAborted', gameId)

      if (gameId === this.game.id) {
        this.gameAborted = true

        this.addNotification({
          message: 'Opponent player aborted the game',
          type: NOTIFICATION_TYPE.ERROR,
          timeout: 0
        })
      }
    },

    onGameFinished() {
      console.log('onGameFinished')

      this.gameFinished = true

      this.$socket.emit('game:finish', this.game.id)
    },

    onContinue() {
      console.log('onContinue')
    },

    onAttack() {
      console.log('onAttack')

      this.$socket.emit('game:move', PLAYER_MOVE.ATTACK)
    },

    onSpell() {
      console.log('onSpell')

      this.$socket.emit('game:move', PLAYER_MOVE.SPELL)
    },

    onHeal() {
      console.log('onHeal')

      this.$socket.emit('game:move', PLAYER_MOVE.HEAL)
    },

    onDefence() {
      console.log('onDefence')

      this.$socket.emit('game:move', PLAYER_MOVE.DEFENCE)
    },

    async addGameMessages(game) {
      if (!game.moves.length > 0) return

      const lastMove = game.moves[game.moves.length - 1]

      const playerKey = lastMove.playerKey
      const opponentPlayerKey = playerKey === 1 ? 2 : 1

      const playerId = game.players[playerKey].id
      const opponentPlayerId = game.players[opponentPlayerKey].id

      const player = this.findPlayer(playerId)
      const opponentPlayer = this.findPlayer(opponentPlayerId)

      const playerNFTId = game.players[playerKey].NFT_id
      const opponentPlayerNFTId = game.players[opponentPlayerKey].NFT_id

      const playerNFT = this.findNFT(playerNFTId)
      // eslint-disable-next-line no-unused-vars
      const opponentPlayerNFT = this.findNFT(opponentPlayerNFTId)

      if (lastMove.move === PLAYER_MOVE.ATTACK) {
        this.messages.push(`${player.name} の攻撃！`)
        await this.playAudio(SOUND_EFFECT.ATTACK)

        const { isMiss, isCritical, isFinish, damage } = {
          ...lastMove.payload
        }

        if (isMiss) {
          this.messages.push('ミス！')
          this.messages.push(`${opponentPlayer.name} にダメージを与えられない`)
        } else {
          if (isCritical) {
            this.messages.push('クリティカルヒット！')
            await this.playAudio(SOUND_EFFECT.ATTACK_CRITICAL)
          }

          if (damage > 0) {
            this.messages.push(
              `${opponentPlayer.name} に ${damage} のダメージを与えた！`
            )
          }

          if (isFinish) {
            this.addGameFinishMessages(player, opponentPlayer)
          }
        }
      } else if (lastMove.move === PLAYER_MOVE.SPELL) {
        const spellLabel = this.$filters.spellLabel(playerNFT)

        this.messages.push(`${player.name} の${spellLabel}攻撃！`)

        const { isFinish, damage } = {
          ...lastMove.payload
        }

        if (damage > 0) {
          this.messages.push(
            `${opponentPlayer.name} に ${damage} のダメージを与えた！`
          )
          await this.playAudio(SOUND_EFFECT.SPELL)
        }

        if (isFinish) {
          this.addGameFinishMessages(player, opponentPlayer)
        }
      } else if (lastMove.move === PLAYER_MOVE.HEAL) {
        this.messages.push(`${player.name} の回復！`)

        const { recoveryAmount } = {
          ...lastMove.payload
        }

        if (recoveryAmount === 0) {
          this.messages.push('ミス')
          this.messages.push(`${player.name} は HP を回復できなかった！`)
        } else {
          await this.playAudio(SOUND_EFFECT.HEAL)

          this.messages.push(
            `${player.name} の HP が ${recoveryAmount} 回復した！`
          )
        }
      } else if (lastMove.move === PLAYER_MOVE.DEFENCE) {
        this.messages.push(
          `${player.name} は防御態勢を取って力をためている・・・！`
        )
        await this.playAudio(SOUND_EFFECT.DEFENCE)

        const { recoveryAmount, mustCritical } = {
          ...lastMove.payload
        }

        if (recoveryAmount > 0) {
          this.messages.push(
            `${player.name} の攻撃回数が ${recoveryAmount} 回復した！`
          )
        }

        if (mustCritical) {
          this.messages.push(`${player.name} に力がみなぎってきた！`)
          this.messages.push(
            `${player.name} の次ターンの攻撃は必ずクリティカルヒットになる予感・・・！`
          )
        }
      }
    },

    addPlayerStatsMessages(player, playerFullStats) {
      const { exp, win, lose, totalMatch, winRate } = playerFullStats

      if (totalMatch < 0) {
        this.messages.push(`[${player.name}] の初バトル！`)
      } else {
        this.messages.push(`[${player.name}] 経験値 ${exp}`)
        this.messages.push(
          `勝率 ${winRate}% (勝ち ${win} + 負け ${lose} = 合計 ${totalMatch})`
        )
      }
    },

    addGameFinishMessages(winner, loser) {
      this.messages.push(`${loser.name} は気絶してしまった！`)
      this.messages.push(`${winner.name} の勝利！`)
      this.messages.push('------------------')

      let addExp = 0
      let addWin = 0
      let addLose = 0

      if (winner.id === this.player.id) {
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

      this.messages.push(`${addExp} ポイントの経験値を得た！`)
      this.messages.push('------------------')

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
    }
  }
}
</script>
