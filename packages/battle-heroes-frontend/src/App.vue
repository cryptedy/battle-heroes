<template>
  <SplashScreen v-if="isAppLoading || !isSocketConnected" />

  <router-view v-else />

  <div id="teleport"></div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import SplashScreen from '@/components/SplashScreen'

const appTitle = process.env.VUE_APP_TITLE

export default {
  name: 'App',

  components: {
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
      isSocketConnected: 'socket/isConnected'
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
      this.setScrollbar(this.getScrollbar())

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
      this.setScrollbar(this.getScrollbar())

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
    },

    getScrollbar() {
      const result = { vertical: true, horizontal: true }

      try {
        const root =
          document.compatMode == 'BackCompat'
            ? document.body
            : document.documentElement

        result.vertical = root.scrollHeight > root.clientHeight
        result.horizontal = root.scrollWidth > root.clientWidth
        // eslint-disable-next-line no-empty
      } catch (error) {}

      return result
    }
  }
}
</script>
