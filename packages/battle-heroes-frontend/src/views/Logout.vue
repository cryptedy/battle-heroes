<template>
  <SplashScreen message="Logout..." />
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import SplashScreen from '@/components/SplashScreen'

export default {
  name: 'Logout',

  components: {
    SplashScreen
  },

  computed: {
    ...mapGetters({
      isLoginGame: 'game/isLogin'
    })
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
