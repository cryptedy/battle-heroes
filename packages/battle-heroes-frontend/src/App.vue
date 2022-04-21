<template>
  <ErrorScreen v-if="appError" :message="appError">
    <BaseButton type="primary" @click="reload"> RELOAD </BaseButton>
  </ErrorScreen>

  <ErrorScreen v-else-if="socketError" :message="socketError">
    <BaseButton type="primary" @click="connectSocket"> RETRY </BaseButton>
  </ErrorScreen>

  <ErrorScreen v-else-if="socketConnectError" :message="socketConnectError">
    <BaseButton type="primary" @click="connectSocket"> RETRY </BaseButton>
  </ErrorScreen>

  <SplashScreen
    v-else-if="isSocketConnecting"
    message="Connecting to server..."
  />

  <SplashScreen v-else-if="isAppLoading">
    <RandomNFT />
  </SplashScreen>

  <ErrorScreen
    v-else-if="!isSocketConnected"
    message="Could not connect server."
  >
    <BaseButton type="primary" @click="connectSocket"> RETRY </BaseButton>
  </ErrorScreen>

  <router-view v-else />

  <div id="teleport"></div>

  <TheNotification />
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import RandomNFT from '@/components/RandomNFT'
import ErrorScreen from '@/components/ErrorScreen'
import SplashScreen from '@/components/SplashScreen'
import { NOTIFICATION_TYPE } from '@/utils/constants'
import TheNotification from '@/components/TheNotification'
import { getScrollbarState, getScrollbarWidth } from '@/utils/helpers'

const appTitle = process.env.VUE_APP_TITLE

export default {
  name: 'App',

  components: {
    RandomNFT,
    ErrorScreen,
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
      appError: 'app/error',
      socketError: 'socket/error',
      isAppLoading: 'app/isLoading',
      notifications: 'notification/all',
      isSocketConnected: 'socket/isConnected',
      isSocketConnecting: 'socket/isConnecting',
      socketConnectError: 'socket/connectError'
    })
  },

  created() {
    window.addEventListener('load', this.onWindowLoad)
    window.addEventListener('resize', this.onWindowResize)
    window.addEventListener('scroll', this.onWindowScroll)
  },

  async mounted() {
    this.connectSocket()

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
    this.disconnectSocket()

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
      setWindowOffset: 'window/setOffset',
      connectSocket: 'socket/connect',
      disconnectSocket: 'socket/disconnect'
    }),

    reload() {
      location.reload()
    },

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
