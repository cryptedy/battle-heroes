<template>
  <div class="player-detail">
    <div class="player-detail-primary">
      <PlayerAvatar :player="player" />
    </div>

    <div class="player-detail-secondary">
      <div
        class="player-name"
        :class="{ 'is-online': player.socket_ids.length > 0 }"
      >
        {{ player.name }}
      </div>

      <PlayerStats :player="player" />
    </div>
  </div>
</template>

<script>
import PlayerStats from '@/components/PlayerStats'
import PlayerAvatar from '@/components/PlayerAvatar'

export default {
  name: 'PlayerDetail',

  components: {
    PlayerStats,
    PlayerAvatar
  },

  props: {
    player: {
      type: Object,
      required: true
    }
  }
}
</script>
