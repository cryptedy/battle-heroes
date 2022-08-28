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
      <template v-if="playerBattle">
        <BattleSpectateButton :battle="playerBattle" />

        <BattleJoinButton :battle="playerBattle" />

        <BattleRushButton :battle="playerBattle" />

        <BattleDeleteButton :battle="playerBattle" />
      </template>
    </div>
  </BaseListItem>
</template>

<script>
import { mapGetters } from 'vuex'
import NFTList from '@/components/NFTList'
import PlayerStats from '@/components/PlayerStats'
import PlayerAvatar from '@/components/PlayerAvatar'
import PlayerDetail from '@/components/PlayerDetail'
import BattleJoinButton from '@/components/BattleJoinButton'
import BattleRushButton from '@/components/BattleRushButton'
import BattleDeleteButton from '@/components/BattleDeleteButton'
import BattleSpectateButton from '@/components/BattleSpectateButton'

export default {
  name: 'PlayerListItem',

  components: {
    NFTList,
    PlayerStats,
    PlayerAvatar,
    PlayerDetail,
    BattleJoinButton,
    BattleRushButton,
    BattleDeleteButton,
    BattleSpectateButton
  },

  props: {
    player: {
      type: Object,
      required: true
    }
  },

  computed: {
    ...mapGetters({
      findNFT: 'NFT/find',
      battles: 'battle/all',
      findBattle: 'battle/find',
      gamePlayer: 'game/player',
      battleByPlayer: 'battle/byPlayer'
    }),

    playerBattle() {
      return this.battleByPlayer(this.player)
    }
  }
}
</script>
