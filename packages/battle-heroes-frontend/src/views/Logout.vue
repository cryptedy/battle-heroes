<template>
  <BaseSpinner />
  Logout...
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'Logout',

  async created() {
    this.logout().finally(() => {
      this.$router
        .push({ name: 'login' }, () => {})
        .then(() => {
          // TODO: reset all state
        })
    })
  },

  methods: {
    ...mapActions({
      logout: 'auth/logout'
    })
  }
}
</script>
