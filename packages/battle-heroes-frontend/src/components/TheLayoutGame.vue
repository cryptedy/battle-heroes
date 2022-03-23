<template>
  <SplashScreen v-if="!isGameLogin" message="Connecting to game server..." />

  <div v-else class="game">
    <header class="game-header" role="banner">
      <TheAppBar />
    </header>

    <main class="game-main" role="main">
      <section class="section">
        <TheBattleNav :player="player" />
      </section>

      <section class="section">
        <slot />
      </section>
    </main>

    <footer class="game-footer">
      <TheBottomNav />
    </footer>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import TheAppBar from '@/components/TheAppBar'
import SplashScreen from '@/components/SplashScreen'
import TheBattleNav from '@/components/TheBattleNav'
import TheBottomNav from '@/components/TheBottomNav'

export default {
  name: 'TheLayoutGame',

  components: {
    TheAppBar,
    SplashScreen,
    TheBattleNav,
    TheBottomNav
  },

  computed: {
    ...mapGetters({
      player: 'game/player',
      isGameLogin: 'game/isLogin'
    })
  }
}
</script>
