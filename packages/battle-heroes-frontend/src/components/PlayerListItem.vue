<template>
  <BaseListItem class="player-list-item">
    <BaseDrawer direction="bottom">
      <template #trigger>
        <PlayerAvatar :player="player" />
      </template>
      <PlayerNFTs :player="player" />
    </BaseDrawer>

    <div class="player-content">
      <div class="player-content-primary">
        <BaseDrawer direction="bottom">
          <template #trigger>
            <span
              class="player-name"
              :class="{ 'is-online': player.socket_ids.length > 0 }"
            >
              {{ player.name }}
            </span>
          </template>
          <PlayerNFTs :player="player" />
        </BaseDrawer>

        <span class="player-devices">
          {{ player.socket_ids.length }} devices
        </span>
      </div>

      <div class="player-content-secondary">
        <ul class="player-content-list">
          <li class="player-content-list-item">
            <span class="player-content-list-item-text">
              EXP {{ player.exp }}
            </span>
          </li>
          <li class="player-content-list-item">
            <span class="player-content-list-item-text">
              WIN {{ player.win }}
            </span>
          </li>
          <li class="player-content-list-item">
            <span class="player-content-list-item-text">
              LOSE {{ player.lose }}
            </span>
          </li>
          <li class="player-content-list-item">
            <FontAwesomeIcon icon="layer-group" size="1x" />
            <span class="player-content-list-item-text">
              {{ player.nft_ids.length }}
            </span>
          </li>
        </ul>
      </div>
    </div>

    <div class="player-actions">
      <PlayerState :player="player" />
    </div>
  </BaseListItem>
</template>

<script>
import PlayerNFTs from '@/components/PlayerNFTs'
import PlayerState from '@/components/PlayerState'
import PlayerAvatar from '@/components/PlayerAvatar'

export default {
  name: 'PlayerListItem',

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
