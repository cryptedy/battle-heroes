<template>
  <p v-if="!players.length > 0">No players.</p>

  <BaseList v-else>
    <BaseListItem v-for="player in players" :key="player.id">
      <Player :player="player" />
    </BaseListItem>
  </BaseList>
</template>

<script>
import Player from '@/components/Player'

export default {
  name: 'PlayerList',

  components: {
    Player
  },

  props: {
    players: {
      type: Array,
      required: true
    }
  }
}
</script>
