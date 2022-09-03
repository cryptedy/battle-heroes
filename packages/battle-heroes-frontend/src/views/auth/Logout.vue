<template>
  <SplashScreen message="Logout..." />
</template>

<script>
import { mapActions } from 'vuex'
import SplashScreen from '@/components/SplashScreen'

export default {
  name: 'LogoutView',

  components: {
    SplashScreen
  },

  async created() {
    await this.logoutGame()

    await this.logout()

    this.$router.push({ name: 'login' }, () => {})
  },

  methods: {
    ...mapActions({
      logout: 'auth/logout',
      logoutGame: 'game/logout'
    })
  }
}
</script>
