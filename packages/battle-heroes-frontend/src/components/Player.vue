<template>
  <div class="player">
    <PlayerAvatar :player="player" />

    <div class="player-info">
      <h2>{{ player.name }}</h2>
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
                {{ player.token_ids[1].length + player.token_ids[2].length }}
              </template>
              <PlayerNFTs :player="player" />
            </BaseDialog>
          </span>
        </li>
      </ul>
    </div>

    <div class="player-actions">
      <span v-if="player.socket_ids.length > 0"> ONLINE </span>
      <span v-else> OFFLINE </span>

      <span class="player-status is-standby">
        {{ $filters.playerState(player.state) }}
      </span>
    </div>
  </div>
</template>

<script>
import PlayerNFTs from '@/components/PlayerNFTs'
import PlayerAvatar from '@/components/PlayerAvatar'

export default {
  name: 'Player',

  components: {
    PlayerNFTs,
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

<style lang="scss">
.player {
  display: flex;
  justify-content: space-between;
  padding: 16px 24px;

  &-avatar {
    width: 42px;
    height: 42px;
    margin-right: 16px;
  }

  &-info {
    width: 100%;

    &-list {
      display: flex;
      width: 100%;
      height: 100%;

      &-item {
        .svg-inline--fa {
          margin-right: 6px;
        }

        &-text {
          margin-right: 12px;
        }
      }
    }
  }

  &-actions {
    display: flex;
    align-items: center;
  }
}
</style>
