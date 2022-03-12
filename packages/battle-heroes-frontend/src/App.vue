<template>
  <SplashScreen v-if="isAppLoading" />

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
      appTitle: appTitle
    }
  },

  computed: {
    ...mapGetters({
      isAppLoading: 'app/isLoading'
    })
  },

  async mounted() {
    this.$socket.connect()
  },

  beforeUnmount() {
    this.$socket.disconnect()
  }
}
</script>
