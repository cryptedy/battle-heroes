<template>
  <div class="player" :class="{ 'is-online': player.socket_ids.length > 0 }">
    <PlayerAvatar :player="player" />

    <div class="player-info">
      <h2 class="player-name">
        {{ player.name }} - {{ player.socket_ids.length }} devices
      </h2>
      <ul class="player-info-list">
        <li class="player-info-list-item">
          <FontAwesomeIcon icon="star" size="1x" />
          <span class="player-info-list-item-text">
            {{ player.level }}
          </span>
        </li>
        <li class="player-info-list-item">
          <FontAwesomeIcon icon="layer-group" size="1x" />
          <span class="player-info-list-item-text">
            <BaseDialog>
              <template #trigger>
                {{ player.nft_ids.length }}
              </template>
              <PlayerNFTs :player="player" />
            </BaseDialog>
          </span>
        </li>
      </ul>
    </div>

    <div class="player-actions">
      <PlayerState :player="player" />
    </div>
  </div>
</template>

<script>
import PlayerNFTs from '@/components/PlayerNFTs'
import PlayerState from '@/components/PlayerState'
import PlayerAvatar from '@/components/PlayerAvatar'

export default {
  name: 'Player',

  components: {
    PlayerNFTs,
    PlayerState,
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
