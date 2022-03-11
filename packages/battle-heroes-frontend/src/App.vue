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
      appLoaded: 'app/loaded',
      appLoading: 'app/loading'
    }),

    showSplashScreen() {
      return (this.appLoading || this.loading) && !this.appLoaded
    }
  },

  mounted() {
    this.$socket.connect()
  },

  beforeUnmount() {
    this.$socket.disconnect()
  }
}
</script>
