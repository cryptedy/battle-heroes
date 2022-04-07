<template>
  <BaseListItem class="battle-list-item">
    <div class="battle-list-item-primary">
      <img :src="NFT1.image_url" :alt="NFT1.name" width="512" height="512" />
      {{ NFT1.name }}
      -
      {{ player1.name }}
    </div>

    <div class="battle-list-item-secondary">
      <template v-if="!player2"> NO PLAYER 2 </template>
      <template v-else>
        VS

        <img :src="NFT2.image_url" :alt="NFT2.name" width="512" height="512" />
        {{ NFT2.name }}
        -
        {{ player2.name }}
      </template>
    </div>

    <div class="battle-list-item-actions">
      <BaseDialog
        :open="dialogShown"
        title="Select NFTs"
        @close="onCloseDialog"
      >
        <SelectNFTs :player="player" @select="onSelectNFT" />
      </BaseDialog>

      <BaseButton
        v-if="player1.id !== player.id"
        type="primary"
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
    }),

    player1() {
      return this.findPlayer(this.battle.players[1].id)
    },

    player2() {
      return this.findPlayer(this.battle.players[2].id)
    },

    NFT1() {
      return this.findNFT(this.battle.NFTs[1].id)
    },

    NFT2() {
      return this.findNFT(this.battle.NFTs[1].id)
    }
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
