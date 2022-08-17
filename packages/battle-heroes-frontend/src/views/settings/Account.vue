<template>
  <p>{{ player.name }}</p>

  <hr />

  <ToggleAudio />

  <hr />

  <PlayerUpdateButton />

  <hr />

  <router-link v-slot="{ href, navigate }" custom :to="{ name: 'logout' }">
    <BaseButton :href="href" @click="navigate"> LOGOUT </BaseButton>
  </router-link>
</template>

<script>
import { mapGetters } from 'vuex'
import ToggleAudio from '@/components/ToggleAudio'
import PlayerUpdateButton from '@/components/PlayerUpdateButton.vue'

export default {
  name: 'AccountSettings',

  components: {
    ToggleAudio,
    PlayerUpdateButton
  },

  computed: {
    ...mapGetters({
      player: 'game/player'
    })
  }
}
</script>
