<template>
  <ErrorScreen v-if="socketError" :message="socketError">
    <BaseButton type="primary" @click="retry"> RETRY </BaseButton>
  </ErrorScreen>

  <ErrorScreen v-else-if="socketConnectError" :message="socketConnectError">
    <BaseButton type="primary" @click="retry"> RETRY </BaseButton>
  </ErrorScreen>

  <SplashScreen
    v-else-if="isSocketConnecting"
    message="Reconnecting to the server..."
  >
    <RandomNFT />
  </SplashScreen>

  <ErrorScreen
    v-else-if="!isSocketConnected"
    message="Disconnected to the server."
  >
    <BaseButton type="primary" @click="retry"> RETRY </BaseButton>
  </ErrorScreen>

  <ErrorScreen v-else-if="!isGameLogin" message="Could not login to the game">
    <BaseButton type="primary" @click="retry"> RETRY </BaseButton>
  </ErrorScreen>

  <template v-else-if="isGameView">
    <slot />
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
import SplashScreen from '@/components/SplashScreen'
import TheBottomNav from '@/components/TheBottomNav'
import { BATTLE_STATE, NOTIFICATION_TYPE } from '@/utils/constants'

export default {
  name: 'TheLayoutGame',

  components: {
    TheAppBar,
    RandomNFT,
    ErrorScreen,
    SplashScreen,
    TheBottomNav
  },

  computed: {
    ...mapGetters({
      player: 'game/player',
      isGameLogin: 'game/isLogin',
      socketError: 'socket/error',
      playerBattle: 'game/playerBattle',
      notifications: 'notification/all',
      isSocketConnected: 'socket/isConnected',
      socketConnectError: 'socket/connectError',
      isSocketConnecting: 'socket/isConnecting'
    }),

    isGameView() {
      return this.$route.name === 'game'
    }
  },

  beforeMount() {
    console.log('TheLayoutGame:beforeMount')

    if (this.playerBattle && this.playerBattle.state !== BATTLE_STATE.CREATED) {
      this.$router.push({
        name: 'game',
        params: {
          battleId: this.playerBattle.id
        }
      })
    }
  },

  mounted() {
    console.log('TheLayoutGame:mounted')

    this.$socket.on('battle:matched', battleId => {
      console.log('battle:matched', battleId)

      // TODO: user confirmation

      this.addNotification({
        message: 'Battle matched!',
        type: NOTIFICATION_TYPE.SUCCESS
      })

      this.$router.push(
        {
          name: 'game',
          params: {
            battleId: battleId
          }
        },
        () => {}
      )
    })
  },

  beforeUnmount() {
    this.$socket.off('battle:matched')
  },

  methods: {
    ...mapActions({
      loginGame: 'game/login',
      connectSocket: 'socket/connect',
      addNotification: 'notification/add'
    }),

    retry() {
      location.reload()
    }
  }
}
</script>
