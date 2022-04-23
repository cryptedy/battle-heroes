<template>
  <BaseDrawer direction="bottom" :title="player.name">
    <template #trigger>
      <div
        class="player-state"
        :class="`is-${$filters.playerState(player.state).toLowerCase()}`"
      >
        {{ $filters.playerState(player.state).toUpperCase() }}
      </div>
    </template>

    <BattleNav :player="player" />
  </BaseDrawer>

  <!-- <template v-if="isPlayer">
    <BaseDrawer direction="bottom" :title="player.name">
      <template #trigger>
        <div
          class="player-state"
          :class="`is-${$filters.playerState(player.state).toLowerCase()}`"
        >
          {{ $filters.playerState(player.state).toUpperCase() }}
        </div>
      </template>

      <BattleNav :player="player" />
    </BaseDrawer>
  </template>

  <div
    v-else
    class="player-state"
    :class="`is-${$filters.playerState(player.state).toLowerCase()}`"
  >
    {{ $filters.playerState(player.state).toUpperCase() }}
  </div> -->
</template>

<script>
import { mapGetters } from 'vuex'
import BattleNav from '@/components/BattleNav'

export default {
  name: 'PlayerState',

  components: {
    BattleNav
  },

  props: {
    player: {
      type: Object,
      required: true
    }
  },

  data() {
    return {
      dialogShown: false
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
