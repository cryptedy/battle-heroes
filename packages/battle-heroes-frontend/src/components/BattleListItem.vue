<template>
  <BaseListItem class="battle-list-item">
    <div>
      <img
        :src="battle.player.NFT.image_url"
        :alt="battle.player.NFT.name"
        width="64"
        height="64"
      />
    </div>

    <div class="battle-content">
      <div class="battle-content-primary">
        {{ battle.player.NFT.name }}
      </div>

      <div class="battle-content-secondary">
        {{ findPlayer(battle.player.id).name }}

        <template v-if="battle.opponent_player.id">
          VS
          {{ findPlayer(battle.opponent_player.id).name }}
        </template>
      </div>
    </div>

    <div class="player-actions">
      <BaseButton v-if="battle.player.id !== player.id"> BATTLE! </BaseButton>
    </div>
  </BaseListItem>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'BattleListItem',

  props: {
    battle: {
      type: Object,
      required: true
    }
  },

  computed: {
    ...mapGetters({
      player: 'game/player',
      findPlayer: 'player/find'
    })
  }
}
</script>
