<template>
  <SplashScreen v-if="showSplashScreen" />

  <router-view v-else />
</template>

<script>
import { mapGetters } from 'vuex'
import SplashScreen from '@/components/SplashScreen'

const appTitle = process.env.VUE_APP_TITLE

export default {
  name: 'App',

  components: {
    SplashScreen
  },

  data() {
    return {
      appTitle: appTitle,
      loading: false
    }
  },

  computed: {
    ...mapGetters({
      user: 'auth/user',
      check: 'auth/check',
      appLoaded: 'app/loaded',
      appLoading: 'app/loading',
      userTokenIds: 'NFT/userTokenIds'
    }),

    showSplashScreen() {
      return (this.appLoading || this.loading) && !this.appLoaded
    }
  },

  watch: {
    // eslint-disable-next-line no-unused-vars
    check(value, oldValue) {
      if (value) {
        this.$socket.connect()
      } else {
        this.$socket.disconnect()
      }
    }
  },

  mounted() {
    this.$socket.on('connect', () =>
      this.$socket.emit('game:join', {
        user: this.user,
        tokenIds: this.userTokenIds
      })
    )
  },

  beforeUnmount() {
    this.$socket.off('connect')
  }
}
</script>
