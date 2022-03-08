<template>
  <SplashScreen v-if="!initialized" />

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
      initialized: 'app/initialized'
    })
  }
}
</script>
