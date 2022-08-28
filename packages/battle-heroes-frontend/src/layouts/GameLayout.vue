<template>
  <ErrorScreen v-if="socketError" :message="socketError">
    <BaseButton type="primary" @click="retry"> リトライ </BaseButton>
  </ErrorScreen>

  <ErrorScreen v-else-if="socketConnectError" :message="socketConnectError">
    <BaseButton type="primary" @click="retry"> リトライ </BaseButton>
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
    <BaseButton type="primary" @click="retry"> リトライ </BaseButton>
  </ErrorScreen>

  <ErrorScreen v-else-if="!isGameLogin" message="Could not login to the game">
    <BaseButton type="primary" @click="retry"> リトライ </BaseButton>
  </ErrorScreen>

  <template v-else-if="isBattleView">
    <slot :key="$route.params.battleId" />
  </template>

  <div v-else class="game">
    <header class="game-header" role="banner">
      <TheAppBar />
    </header>

    <main class="game-main" role="main">
      <slot />
    </main>

    <footer class="game-footer">
      <TheBottomNav />
    </footer>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import TheAppBar from '@/components/TheAppBar'
import RandomNFT from '@/components/RandomNFT'
import ErrorScreen from '@/components/ErrorScreen'
import BaseButton from '@/components/BaseButton.vue'
import SplashScreen from '@/components/SplashScreen'
import TheBottomNav from '@/components/TheBottomNav'
import { BATTLE_STATE, NOTIFICATION_TYPE } from '@/utils/constants'

export default {
  name: 'GameLayout',

  components: {
    TheAppBar,
    RandomNFT,
    ErrorScreen,
    SplashScreen,
    TheBottomNav,
    BaseButton
  },

  data() {
    return {
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

    isBattleView() {
      return this.$route.name === 'battles.show'
    }
  },

  beforeMount() {
    console.log('GameLayout:beforeMount')

    if (this.playerBattle && this.playerBattle.state !== BATTLE_STATE.ENDED) {
      this.$router.push({
        name: 'battles.show',
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

    this.$socket.on('player:created', player => this.addPlayer(player))
    this.$socket.on('player:updated', player => this.updatePlayer(player))
    this.$socket.on('battle:created', battle => this.addBattle(battle))
    this.$socket.on('battle:updated', battle => this.updateBattle(battle))
    this.$socket.on('battle:deleted', battleId => this.removeBattle(battleId))
    this.$socket.on('message:created', message => this.addMessage(message))
    this.$socket.on('message:deleted', messageId =>
      this.removeMessage(messageId)
    )
  },

  beforeUnmount() {
    console.log('GameLayout:beforeUnmount')

    this.$socket.off('connect')
    this.$socket.off('disconnect')
    this.$socket.off('connect_error')
    this.$socket.io.off('error')
    this.$socket.off('game:error')

    this.$socket.off('player:created')
    this.$socket.off('player:updated')
    this.$socket.off('battle:created')
    this.$socket.off('battle:updated')
    this.$socket.off('battle:deleted')
    this.$socket.off('message:created')
    this.$socket.off('message:deleted')
  },

  methods: {
    ...mapActions({
      loginGame: 'game/login',
      addBattle: 'battle/add',
      addPlayer: 'player/add',
      logoutGame: 'game/logout',
      addMessage: 'message/add',
      updateBattle: 'battle/update',
      removeBattle: 'battle/remove',
      updatePlayer: 'player/update',
      removeMessage: 'message/remove',
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
