<template>
  <BaseEmpty v-if="!players.length > 0" />

  <BaseList v-else class="player-list">
    <PlayerListItem
      v-for="player in players"
      :key="player.id"
      :player="player"
    />
  </BaseList>
</template>

<script>
import PlayerListItem from '@/components/PlayerListItem'

export default {
  name: 'PlayerList',

  components: {
    PlayerListItem
  },

  props: {
    players: {
      type: Array,
      required: true
    }
  }
}
</script>
