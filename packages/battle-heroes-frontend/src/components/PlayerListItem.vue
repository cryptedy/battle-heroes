<template>
  <BaseListItem class="player-list-item">
    <div class="player-list-item-primary">
      <BaseDrawer direction="bottom" :title="player.name">
        <template #trigger>
          <PlayerAvatar :player="player" />
        </template>
        <PlayerDetail :player="player" />
        <PlayerNFTList :player="player" />
      </BaseDrawer>
    </div>

    <div class="player-list-item-secondary">
      <div
        class="player-name"
        :class="{ 'is-online': player.socket_ids.length > 0 }"
      >
        <BaseDrawer direction="bottom" :title="player.name">
          <template #trigger>
            {{ player.name }}
          </template>

          <PlayerDetail :player="player" />
          <PlayerNFTList :player="player" />
        </BaseDrawer>

        <span class="player-devices">
          {{ player.socket_ids.length }}
        </span>
      </div>

      <PlayerStats :player="player" />
    </div>

    <div class="player-list-item-actions">
      <PlayerState :player="player" />
    </div>
  </BaseListItem>
</template>

<script>
import PlayerState from '@/components/PlayerState'
import PlayerStats from '@/components/PlayerStats'
import PlayerAvatar from '@/components/PlayerAvatar'
import PlayerDetail from '@/components/PlayerDetail'
import PlayerNFTList from '@/components/PlayerNFTList'

export default {
  name: 'PlayerListItem',

  components: {
    PlayerState,
    PlayerStats,
    PlayerAvatar,
    PlayerDetail,
    PlayerNFTList
  },

  props: {
    player: {
      type: Object,
      required: true
    }
  }
}
</script>
