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

  <TheNotification />
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import RandomNFT from '@/components/RandomNFT'
import SplashScreen from '@/components/SplashScreen'
import { NOTIFICATION_TYPE } from '@/utils/constants'
import TheNotification from '@/components/TheNotification'
import { getScrollbarState, getScrollbarWidth } from '@/utils/helpers'

const appTitle = process.env.VUE_APP_TITLE

export default {
  name: 'App',

  components: {
    RandomNFT,
    SplashScreen,
    TheNotification
  },

  unwatch: {
    network: null
  },

  data() {
    return {
      appTitle: appTitle
    }
  },

  computed: {
    ...mapGetters({
      isAppLoading: 'app/isLoading',
      notifications: 'notification/all',
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

    this.$options.unwatch.network = this.$store.watch(
      (state, getters) => getters['network/isOnline'],
      (value, oldValue) => {
        if (value) {
          this.addNotification({
            message: 'ONLINE!',
            type: NOTIFICATION_TYPE.SUCCESS
          })
        } else if (oldValue) {
          this.addNotification({
            message: 'FOOLINE!',
            type: NOTIFICATION_TYPE.ERROR
          })
        }
      }
    )
  },

  beforeUnmount() {
    this.$socket.disconnect()

    window.removeEventListener('load', this.onWindowLoad)
    window.removeEventListener('resize', this.onWindowResize)
    window.removeEventListener('scroll', this.onWindowScroll)

    if (this.$options.unwatch.network) {
      this.$options.unwatch.network()
    }
  },

  methods: {
    ...mapActions({
      setScrollbar: 'scrollbar/set',
      setWindowSize: 'window/setSize',
      addNotification: 'notification/add',
      setWindowOffset: 'window/setOffset'
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
