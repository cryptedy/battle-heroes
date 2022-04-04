<template>
  <p>{{ player.name }}</p>

  <router-link v-slot="{ href, navigate }" custom :to="{ name: 'logout' }">
    <BaseButton :href="href" @click="navigate"> LOGOUT </BaseButton>
  </router-link>
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
