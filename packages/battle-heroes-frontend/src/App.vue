<template>
  <div id="teleport"></div>

  <TheNotification />

  <ErrorScreen v-if="appError" :message="appError">
    <BaseButton type="primary" @click="reload"> RELOAD </BaseButton>
  </ErrorScreen>

  <SplashScreen v-else-if="isAppLoading">
    <RandomNFT />
  </SplashScreen>

  <component :is="layout" v-else>
    <router-view />
  </component>
</template>

<script>
import { shallowRef } from 'vue'
import WebLayout from '@/layouts/WebLayout'
import GameLayout from '@/layouts/GameLayout'
import { mapGetters, mapActions } from 'vuex'
import RandomNFT from '@/components/RandomNFT'
import ErrorScreen from '@/components/ErrorScreen'
import DefaultLayout from '@/layouts/DefaultLayout'
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
      appTitle: appTitle,
      layout: shallowRef(DefaultLayout)
    }
  },

  computed: {
    ...mapGetters({
      appError: 'app/error',
      isAppLoading: 'app/isLoading',
      notifications: 'notification/all'
    })
  },

  watch: {
    $route: {
      // eslint-disable-next-line no-unused-vars
      async handler(value, oldValue) {
        try {
          if (value.meta.layout === 'web') {
            this.layout = shallowRef(WebLayout)
          } else if (value.meta.layout === 'game') {
            this.layout = shallowRef(GameLayout)
          } else {
            this.layout = shallowRef(DefaultLayout)
          }
        } catch (error) {
          console.log(error)

          this.layout = shallowRef(DefaultLayout)
        }
      },
      immediate: true
    }
  },

  created() {
    window.addEventListener('load', this.onWindowLoad)
    window.addEventListener('resize', this.onWindowResize)
    window.addEventListener('scroll', this.onWindowScroll)
  },

  async mounted() {
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
            message: 'OFFLINE!',
            type: NOTIFICATION_TYPE.ERROR
          })
        }
      }
    )
  },

  beforeUnmount() {
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
