<template>
  <TheLayout>
    <h1>PLAYERS</h1>

    <p v-if="!players.length > 0">No players.</p>

    <BaseList v-else>
      <BaseListItem v-for="player in players" :key="player.id">
        <Player :player="player" />
      </BaseListItem>
    </BaseList>
  </TheLayout>
</template>

<script>
import { mapGetters } from 'vuex'
import Player from '@/components/Player'
import TheLayout from '@/components/TheLayout'

export default {
  name: 'Players',

  components: {
    Player,
    TheLayout
  },

  data() {
    return {
      drawerShown: false,
      dialogShown: false
    }
  },

  computed: {
    ...mapGetters({
      players: 'player/all'
    })
  }
}
</script>
