<template>
  <ErrorScreen v-if="socketError" :message="socketError">
    <BaseButton type="primary" @click="retry"> RETRY </BaseButton>
  </ErrorScreen>

  <ErrorScreen v-else-if="socketConnectError" :message="socketConnectError">
    <BaseButton type="primary" @click="retry"> RETRY </BaseButton>
  </ErrorScreen>

  <SplashScreen
    v-else-if="attemptingGameLogin || reconnectingSocket"
    :message="
      attemptingGameLogin
        ? 'Login to the server...'
        : 'Reconnecting to the server...'
    "
  >
    <RandomNFT />
  </SplashScreen>

  <ErrorScreen
    v-else-if="!$socket.connected"
    message="Disconnected to the server"
  >
    <BaseButton type="primary" @click="retry"> RETRY </BaseButton>
  </ErrorScreen>

  <ErrorScreen v-else-if="!isGameLogin" message="Could not login to the game">
    <BaseButton type="primary" @click="retry"> RETRY </BaseButton>
  </ErrorScreen>

  <template v-else-if="isBattleView">
    <slot :key="battleComponentKey" />
  </template>

  <div v-else class="game">
    <header v-if="showHeader" class="game-header" role="banner">
      <TheAppBar />
    </header>

    <main class="game-main" role="main">
      <div v-if="isPlayerStateStandby && showNotification" class="information">
        <p class="information-content">
          <BaseSpinner />
          対戦相手の参加を待っています...
        </p>
      </div>

      <slot />
    </main>

    <footer v-if="showFooter" class="game-footer">
      <TheBottomNav />
    </footer>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import TheAppBar from '@/components/TheAppBar'
import RandomNFT from '@/components/RandomNFT'
import ErrorScreen from '@/components/ErrorScreen'
import SplashScreen from '@/components/SplashScreen'
import TheBottomNav from '@/components/TheBottomNav'
import {
  BATTLE_STATE,
  PLAYER_STATE,
  NOTIFICATION_TYPE
} from '@/utils/constants'

export default {
  name: 'GameLayout',

  components: {
    TheAppBar,
    RandomNFT,
    ErrorScreen,
    SplashScreen,
    TheBottomNav
  },

  data() {
    return {
      battleComponentKey: false,
      attemptingGameLogin: false,
      reconnectingSocket: false,
      socketConnectError: '',
      socketError: ''
    }
  },

  computed: {
    ...mapGetters({
      player: 'game/player',
      isGameLogin: 'game/isLogin',
      playerBattle: 'game/playerBattle',
      notifications: 'notification/all'
    }),

    showHeader() {
      if (this.$route.name === 'battle-offline') {
        return false
      }

      return true
    },

    showNotification() {
      if (this.$route.name === 'battle-offline') {
        return false
      }

      return true
    },

    showFooter() {
      if (this.$route.name === 'battle-offline') {
        return false
      }

      return true
    },

    isPlayerStateStandby() {
      return this.player.state === PLAYER_STATE.STANDBY && this.playerBattle
    },

    isBattleView() {
      return this.$route.name === 'battle'
    }
  },

  beforeMount() {
    console.log('GameLayout:beforeMount')

    if (this.playerBattle && this.playerBattle.state !== BATTLE_STATE.CREATED) {
      this.$router.push({
        name: 'battle',
        params: {
          battleId: this.playerBattle.id
        }
      })
    }
  },

  mounted() {
    console.log('GameLayout:mounted')

    this.$socket.on('connect', () => this.onSocketConnect())
    this.$socket.on('disconnect', reason => this.onSocketDisconnect(reason))
    this.$socket.on('connect_error', error => this.onSocketConnectError(error))
    this.$socket.io.on('error', error => this.onSocketError(error))
    this.$socket.on('game:error', error => this.onGameError(error))
    this.$socket.on('battle:matched', battleId =>
      this.onBattleMatched(battleId)
    )
  },

  beforeUnmount() {
    console.log('GameLayout:beforeUnmount')

    this.$socket.off('connect')
    this.$socket.off('disconnect')
    this.$socket.off('connect_error')
    this.$socket.io.off('error')
    this.$socket.off('game:error')
    this.$socket.off('battle:matched')
  },

  methods: {
    ...mapActions({
      loginGame: 'game/login',
      logoutGame: 'game/logout',
      addNotification: 'notification/add'
    }),

    onSocketConnect() {
      console.log('onSocketConnect')

      this.reconnectingSocket = false
      this.socketConnectError = ''
      this.socketError = ''

      this.reloginGame()
    },

    onSocketDisconnect(reason) {
      console.log('onSocketDisconnect')

      this.logoutGame()

      if (reason === 'ping timeout' || reason === 'transport close') {
        this.reconnectSocket()
      } else {
        this.addNotification({
          message: `socket disconnect: ${reason}`,
          type: NOTIFICATION_TYPE.ERROR,
          timeout: 0
        })
      }
    },

    onSocketConnectError(error) {
      console.log('onSocketConnectError', error)

      this.reconnectingSocket = false
      this.socketConnectError = error.message
    },

    onSocketError(error) {
      console.log('onSocketError', error)

      this.reconnectingSocket = false
      this.socketError = error.message
    },

    onGameError(error) {
      console.log('onGameError', error)

      this.addNotification({
        message: `${error.message}: ${error.stack}`,
        type: NOTIFICATION_TYPE.ERROR,
        timeout: 0
      })
    },

    onBattleMatched(battleId) {
      console.log('onBattleMatched', battleId)

      // TODO: user confirmation

      this.addNotification({
        message: 'Battle matched',
        type: NOTIFICATION_TYPE.SUCCESS
      })

      if (this.isBattleView) {
        if (this.$route.params.battleId === battleId) {
          this.reloadBattleView()
        } else {
          this.$router
            .replace(
              {
                name: 'battle',
                params: {
                  battleId: battleId,
                  splash: 'reload'
                }
              },
              () => {}
            )
            .then(() => this.reloadBattleView())
        }
      } else {
        if (this.$route.name === 'battle-offline') {
          this.$router.push(
            {
              name: 'battle',
              params: {
                battleId: battleId,
                splash: 'challenger'
              }
            },
            () => {}
          )
        } else {
          this.$router.push(
            {
              name: 'battle',
              params: {
                battleId: battleId,
                splash: 'matched'
              }
            },
            () => {}
          )
        }
      }
    },

    reloadBattleView() {
      console.log('reloadBattleView')

      return (this.battleComponentKey = !this.battleComponentKey)
    },

    async reloginGame() {
      console.log('reloginGame')

      this.attemptingGameLogin = true

      try {
        await this.loginGame()
      } catch (error) {
        this.addNotification({
          message: `${error.message}: ${error.stack}`,
          type: NOTIFICATION_TYPE.ERROR,
          timeout: 0
        })
      }

      this.attemptingGameLogin = false
    },

    reconnectSocket() {
      console.log('reconnectSocket')

      if (this.reconnectingSocket) return

      this.reconnectingSocket = true
      this.socketConnectError = ''
      this.socketError = ''

      this.$socket.connect()
    },

    retry() {
      console.log('retry')

      if (!this.$socket.connected) {
        this.reconnectSocket()
      } else if (!this.isGameLogin) {
        this.reloginGame()
      }
    }
  }
}
</script>
