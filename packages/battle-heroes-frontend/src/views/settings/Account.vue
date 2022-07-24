<template>
  <p>{{ player.name }}</p>

  <hr />

  <PlayerUpdateButton />

  <hr />

  <router-link v-slot="{ href, navigate }" custom :to="{ name: 'logout' }">
    <BaseButton :href="href" @click="navigate"> LOGOUT </BaseButton>
  </router-link>
</template>

<script>
import { mapGetters } from 'vuex'
import PlayerUpdateButton from '@/components/PlayerUpdateButton.vue'

export default {
  name: 'AccountSettings',

  components: {
    PlayerUpdateButton
  },

  computed: {
    ...mapGetters({
      player: 'game/player'
    })
  }
}
</script>
