<template>
  <p>NAME {{ player.name }}</p>
  <p>EXP {{ player.exp }}</p>
  <p>WIN {{ player.win }}</p>
  <p>LOSE {{ player.lose }}</p>

  <hr />

  <ToggleAudioButton />

  <hr />

  <Links />

  <hr />

  <PlayerRenewButton />

  <hr />

  <router-link v-slot="{ href, navigate }" custom :to="{ name: 'logout' }">
    <BaseButton :href="href" @click="navigate"> LOGOUT </BaseButton>
  </router-link>
</template>

<script>
import { mapGetters } from 'vuex'
import Links from '@/components/Links'
import ToggleAudioButton from '@/components/ToggleAudioButton'
import PlayerRenewButton from '@/components/PlayerRenewButton.vue'

export default {
  name: 'AccountSettingsView',

  components: {
    Links,
    ToggleAudioButton,
    PlayerRenewButton
  },

  computed: {
    ...mapGetters({
      player: 'game/player'
    })
  }
}
</script>
