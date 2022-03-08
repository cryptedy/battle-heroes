<template>
  <SplashScreen message="Logout..." />
</template>

<script>
import { mapActions } from 'vuex'
import SplashScreen from '@/components/SplashScreen'

export default {
  name: 'Logout',

  components: {
    SplashScreen
  },

  async created() {
    this.logout().finally(() => {
      this.$router
        .push({ name: 'login' }, () => {})
        .then(() => {
          this.resetState()
        })
    })
  },

  methods: {
    ...mapActions({
      logout: 'auth/logout',
      resetState: 'resetState'
    })
  }
}
</script>
