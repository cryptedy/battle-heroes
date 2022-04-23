<template>
  <BaseListItem class="player-list-item">
    <div class="player-list-item-primary">
      <BaseDrawer direction="bottom" :title="player.name">
        <template #trigger>
          <PlayerAvatar :player="player" />
        </template>
        <PlayerDetail :player="player" />
        <NFTList :player="player" />
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
          <NFTList :player="player" />
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
import { mapGetters } from 'vuex'
import PlayerState from '@/components/PlayerState'
import PlayerStats from '@/components/PlayerStats'
import PlayerAvatar from '@/components/PlayerAvatar'
import PlayerDetail from '@/components/PlayerDetail'
import NFTList from '@/components/NFTList'

export default {
  name: 'PlayerListItem',

  components: {
    PlayerState,
    PlayerStats,
    PlayerAvatar,
    PlayerDetail,
    NFTList
  },

  props: {
    player: {
      type: Object,
      required: true
    }
  },

  computed: {
    ...mapGetters({
      gamePlayer: 'game/player'
    }),

    isPlayer() {
      return this.gamePlayer.id === this.player.id
    }
  }
}
</script>
