<template>
  <BaseListItem class="battle-list-item">
    <div class="battle-content">
      <div class="battle-content-primary">
        <img
          :src="findNFT(battle.player.NFT_id).image_url"
          :alt="findNFT(battle.player.NFT_id).name"
          width="64"
          height="64"
        />
        {{ findNFT(battle.player.NFT_id).name }}
        -
        {{ findPlayer(battle.player.id).name }}
      </div>

      <div class="battle-content-secondary">
        <template v-if="battle.opponent_player.id">
          VS
          <img
            :src="findNFT(battle.opponent_player.NFT_id).image_url"
            :alt="findNFT(battle.opponent_player.NFT_id).name"
            width="64"
            height="64"
          />
          {{ findNFT(battle.opponent_player.NFT_id).name }}
          -
          {{ findPlayer(battle.opponent_player.id).name }}
        </template>
      </div>
    </div>

    <div class="player-actions">
      <BaseDialog :open="dialogShown" @close="onCloseDialog">
        <SelectNFTs :player="player" @select="onSelectNFT" />
      </BaseDialog>

      <BaseButton
        v-if="battle.player.id !== player.id"
        @click="requestBattle(battle)"
      >
        BATTLE!
      </BaseButton>
    </div>
  </BaseListItem>
</template>

<script>
import { mapGetters } from 'vuex'
import SelectNFTs from '@/components/SelectNFTs'

export default {
  name: 'BattleListItem',

  components: {
    SelectNFTs
  },

  props: {
    battle: {
      type: Object,
      required: true
    }
  },

  data() {
    return {
      dialogShown: false,
      selectedBattle: null
    }
  },

  computed: {
    ...mapGetters({
      findNFT: 'NFT/find',
      player: 'game/player',
      findPlayer: 'player/find'
    })
  },

  methods: {
    onCloseDialog() {
      this.dialogShown = false
      this.selectedBattle = null
    },

    onSelectNFT(NFT) {
      this.$socket.emit('battle:request', this.selectedBattle.id, NFT.id)

      this.selectedBattle = null
      this.dialogShown = false
    },

    requestBattle(battle) {
      this.selectedBattle = battle
      this.dialogShown = true
    }
  }
}
</script>
