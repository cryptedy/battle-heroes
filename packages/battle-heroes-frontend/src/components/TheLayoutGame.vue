<template>
  <SplashScreen v-if="!isGameLogin" message="Login to server...">
    <RandomNFT />
  </SplashScreen>

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
import { mapGetters } from 'vuex'
import RandomNFT from '@/components/RandomNFT'
import TheAppBar from '@/components/TheAppBar'
import SplashScreen from '@/components/SplashScreen'
import TheBottomNav from '@/components/TheBottomNav'

export default {
  name: 'TheLayoutGame',

  components: {
    RandomNFT,
    TheAppBar,
    SplashScreen,
    TheBottomNav
  },

  computed: {
    ...mapGetters({
      player: 'game/player',
      isGameLogin: 'game/isLogin'
    })
  },

  mounted() {
    this.$socket.on('battle:matched', battleId => {
      console.log('battle:matched', battleId)

      // TODO: user confirmation

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
  }
}
</script>
