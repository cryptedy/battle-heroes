<template>
  <Spinner />
  Logout...
</template>

<script>
import { mapActions } from 'vuex'
import Spinner from '@/components/Spinner'

export default {
  name: 'Logout',

  components: {
    Spinner
  },

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
