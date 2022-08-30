<template>
  <BaseListItem class="message-list-item">
    <div class="message-list-item-primary">
      <BaseDrawer direction="bottom" :title="messagePlayer.name">
        <template #trigger>
          <PlayerAvatar :player="messagePlayer" />
        </template>

        <PlayerDetail :player="messagePlayer" />
        <NFTList :player="messagePlayer" />
      </BaseDrawer>
    </div>

    <div class="message-list-item-secondary">
      <div class="message-meta">
        <div
          class="player-name"
          :class="{ 'is-online': messagePlayer.socket_ids.length > 0 }"
        >
          <BaseDrawer direction="bottom" :title="messagePlayer.name">
            <template #trigger>
              {{ messagePlayer.name }}
            </template>

            <PlayerDetail :player="messagePlayer" />
            <NFTList :player="messagePlayer" />
          </BaseDrawer>
        </div>

        <span class="message-posted-at">
          {{ $filters.datetime(message.posted_at) }}
        </span>
      </div>

      <div class="message-text">
        {{ message.text }}
      </div>
    </div>

    <div class="message-list-item-actions">
      <button v-if="canDelete" @click="deleteMessage">
        <FontAwesomeIcon icon="xmark" />
      </button>
    </div>
  </BaseListItem>
</template>

<script>
import { mapGetters } from 'vuex'
import NFTList from '@/components/NFTList'
import PlayerAvatar from '@/components/PlayerAvatar'
import PlayerDetail from '@/components/PlayerDetail'

export default {
  name: 'MessageListItem',

  components: {
    NFTList,
    PlayerAvatar,
    PlayerDetail
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
  },

  methods: {
    deleteMessage() {
      this.$socket.emit('message:delete', this.message.id)
    }
  }
}
</script>
