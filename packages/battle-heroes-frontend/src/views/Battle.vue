<template>
  <ErrorScreen v-if="!battle" message="The battle not found">
    <p>The battle has already finished or aborted</p>
    <p style="margin-top: 16px">
      <BaseButton type="primary" @click="leaveBattle">
        <FontAwesomeIcon icon="arrow-left" />
        BACK
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
          <SplashScreen
            v-if="isPlayerBattle && (isBattleStarted || isBattleReady)"
            message="Loading game..."
          >
            <div style="text-align: center">
              <p>{{ player1.name }}'s {{ NFT1.name }}</p>
              <p>⚔️</p>
              <p>{{ player2.name }}'s {{ NFT2.name }}</p>
            </div>
          </SplashScreen>

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
                BACK
              </BaseButton>
            </p>
          </ErrorScreen>
        </template>
      </template>

      <Game
        v-else
        :game="game"
        :aborted="gameAborted"
        :playable="playable"
        :player1="player1"
        :player2="player2"
        :nft1="NFT1"
        :nft2="NFT2"
        @finish="onGameFinished"
        @abort="onGameAbort"
      />
    </template>
  </template>
</template>

<script>
import Game from '@/components/Game'
import { mapGetters, mapActions } from 'vuex'
import ErrorScreen from '@/components/ErrorScreen'
import SplashScreen from '@/components/SplashScreen'
import BattleJoinButton from '@/components/BattleJoinButton'
import { BATTLE_STATE, NOTIFICATION_TYPE } from '@/utils/constants'

export default {
  name: 'Battle',

  components: {
    Game,
    ErrorScreen,
    SplashScreen,
    BattleJoinButton
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
      gameFinished: false
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
  },

  methods: {
    ...mapActions({
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
        this.cachedBattle = this.battle
        this.playable = this.isPlayerBattle

        this.game = game

        this.$socket.on('game:update', this.onGameUpdate)

        this.addNotification({
          message,
          type: NOTIFICATION_TYPE.SUCCESS
        })
      } else {
        this.addNotification({
          message,
          type: NOTIFICATION_TYPE.ERROR,
          timeout: 0
        })
      }
    },

    onGameUpdate(game) {
      console.log('onGameUpdate', game)

      if (game.id === this.game.id) {
        this.game = game
      }
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
    }
  }
}
</script>
