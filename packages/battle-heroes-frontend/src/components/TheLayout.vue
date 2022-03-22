<template>
  <SplashScreen v-if="!isGameLogin" message="Connecting to game server..." />

  <template v-else>
    <div id="app-bar">
      <TheAppBar />
    </div>

    <div id="main">
      <TheMain>
        <TheBattleNav :player="player" />

        <slot />
      </TheMain>
    </div>

    <div id="bottom-nav">
      <TheBottomNav />
    </div>
  </template>
</template>

<script>
import { mapGetters } from 'vuex'
import TheMain from '@/components/TheMain'
import TheAppBar from '@/components/TheAppBar'
import SplashScreen from '@/components/SplashScreen'
import TheBattleNav from '@/components/TheBattleNav'
import TheBottomNav from '@/components/TheBottomNav'

export default {
  name: 'TheLayout',

  components: {
    TheMain,
    TheAppBar,
    SplashScreen,
    TheBattleNav,
    TheBottomNav
  },

  data() {
    return {
      unreadMessageCount: 0,
      selectNFTsDialogShown: false
    }
  },

  computed: {
    ...mapGetters({
      player: 'game/player',
      isGameLogin: 'game/isLogin'
    })
  }
}
</script>
