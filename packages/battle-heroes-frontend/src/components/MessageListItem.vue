<template>
  <BaseListItem class="message-list-item">
    <BaseDrawer direction="bottom">
      <template #trigger>
        <PlayerAvatar :player="messagePlayer" />
      </template>
      <PlayerNFTs :player="messagePlayer" />
    </BaseDrawer>

    <div class="message-content">
      <div class="player-content-primary">
        <BaseDrawer direction="bottom">
          <template #trigger>
            <span
              class="player-name"
              :class="{ 'is-online': messagePlayer.socket_ids.length > 0 }"
            >
              {{ messagePlayer.name }}
            </span>
          </template>
          <PlayerNFTs :player="messagePlayer" />
        </BaseDrawer>

        <span class="message-posted-at">
          {{ $filters.datetime(message.posted_at) }}
        </span>
      </div>

      <div class="player-content-secondary">
        {{ message.text }}
      </div>
    </div>

    <div class="message-actions">
      <BaseButton v-if="canDelete">DELETE</BaseButton>
    </div>
  </BaseListItem>
</template>

<script>
import { mapGetters } from 'vuex'
import PlayerNFTs from '@/components/PlayerNFTs'
import PlayerAvatar from '@/components/PlayerAvatar'

export default {
  name: 'MessageListItem',

  components: {
    PlayerNFTs,
    PlayerAvatar
  },

  props: {
    message: {
      type: Object,
      required: true
    }
  },

  computed: {
    ...mapGetters({
      player: 'game/player',
      findPlayer: 'player/find'
    }),

    messagePlayer() {
      return this.findPlayer(this.message.player_id)
    },

    canDelete() {
      return this.player.id === this.messagePlayer.id
    }
  }
}
</script>
