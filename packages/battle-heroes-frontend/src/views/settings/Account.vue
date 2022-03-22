<template>
  <h2>ACCOUNT</h2>

  {{ player }}

  <p>
    <router-link :to="{ name: 'logout' }"> LOGOUT </router-link>
  </p>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'AccountSettings',

  computed: {
    ...mapGetters({
      player: 'game/player'
    })
  }
}
</script>
