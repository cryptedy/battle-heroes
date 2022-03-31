<template>
  <SplashScreen
    v-if="isSocketReconnecting"
    message="Reconnecting to server..."
  />

  <SplashScreen
    v-else-if="!isSocketConnected"
    message="Connecting to server..."
  />

  <SplashScreen v-else-if="isAppLoading">
    <RandomNFT />
  </SplashScreen>

  <router-view v-else />

  <div id="teleport"></div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import RandomNFT from '@/components/RandomNFT'
import SplashScreen from '@/components/SplashScreen'
import { getScrollbarState, getScrollbarWidth } from '@/utils/helpers'

const appTitle = process.env.VUE_APP_TITLE

export default {
  name: 'App',

  components: {
    RandomNFT,
    SplashScreen
  },

  data() {
    return {
      appTitle: appTitle
    }
  },

  computed: {
    ...mapGetters({
      isAppLoading: 'app/isLoading',
      isSocketConnected: 'socket/isConnected',
      isSocketReconnecting: 'socket/isReconnecting'
    })
  },

  created() {
    window.addEventListener('load', this.onWindowLoad)
    window.addEventListener('resize', this.onWindowResize)
    window.addEventListener('scroll', this.onWindowScroll)
  },

  async mounted() {
    this.$socket.connect()
  },

  beforeUnmount() {
    this.$socket.disconnect()

    window.removeEventListener('load', this.onWindowLoad)
    window.removeEventListener('resize', this.onWindowResize)
    window.removeEventListener('scroll', this.onWindowScroll)
  },

  methods: {
    ...mapActions({
      setWindowSize: 'window/setSize',
      setWindowOffset: 'window/setOffset',
      setScrollbar: 'scrollbar/set'
    }),

    onWindowLoad() {
      this.setScrollbar({
        ...getScrollbarState(),
        width: getScrollbarWidth()
      })

      this.setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      })

      this.setWindowOffset({
        offsetX: window.pageXOffset,
        offsetY: window.pageYOffset
      })
    },

    onWindowResize() {
      this.setScrollbar({
        ...getScrollbarState(),
        width: getScrollbarWidth()
      })

      this.setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      })
    },

    onWindowScroll() {
      this.setWindowOffset({
        offsetX: window.pageXOffset,
        offsetY: window.pageYOffset
      })
    }
  }
}
</script>
