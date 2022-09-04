<template>
  <BaseEmpty v-if="!players.length > 0" text="NO Players" />

  <div v-else class="player">
    <BaseList class="player-list">
      <BaseListItem
        v-for="player in players"
        :key="player.id"
        class="player-list-item"
      >
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
          <BaseButton
            type="primary"
            :disabled="!player.socket_ids.length > 0"
            @click="select(player)"
          >
            選択
          </BaseButton>
        </div>
      </BaseListItem>
    </BaseList>
  </div>
</template>

<script>
import NFTList from '@/components/NFTList'
import PlayerStats from '@/components/PlayerStats'
import PlayerAvatar from '@/components/PlayerAvatar'
import PlayerDetail from '@/components/PlayerDetail'

export default {
  name: 'SelectPlayers',

  components: {
    NFTList,
    PlayerStats,
    PlayerAvatar,
    PlayerDetail
  },

  props: {
    players: {
      type: Object,
      required: true
    }
  },

  emits: ['select'],

  methods: {
    select(player) {
      this.$emit('select', player)
    }
  }
}
</script>
