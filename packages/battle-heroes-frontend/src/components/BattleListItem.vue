<template>
  <BaseListItem
    class="battle-list-item"
    :class="{ 'is-disabled': battle.state === 'ENDED' }"
  >
    <div class="battle-list-item-primary">
      <div class="battle-list-nft">
        <NFTImage class="battle-list-nft-image" :nft="NFT1" />
      </div>

      <div class="battle-list-nft">
        <template v-if="!player2">
          <NFTImage class="battle-list-nft-image" />
        </template>
        <template v-else>
          <NFTImage class="battle-list-nft-image" :nft="NFT2" />
        </template>
      </div>
    </div>

    <div class="battle-list-item-secondary"></div>

    <div class="battle-list-item-actions">
      <BattleSpectateButton :battle="battle" />

      <BattleJoinButton :battle="battle" />

      <BattleRushButton :battle="battle" />

      <BattleDeleteButton :battle="battle" />
    </div>
  </BaseListItem>
</template>

<script>
import { mapGetters } from 'vuex'
import NFTImage from '@/components/NFTImage'
import BattleJoinButton from '@/components/BattleJoinButton'
import BattleRushButton from '@/components/BattleRushButton'
import BattleDeleteButton from '@/components/BattleDeleteButton'
import BattleSpectateButton from '@/components/BattleSpectateButton'

export default {
  name: 'BattleListItem',

  components: {
    NFTImage,
    BattleJoinButton,
    BattleRushButton,
    BattleDeleteButton,
    BattleSpectateButton
  },

  props: {
    battle: {
      type: Object,
      required: true
    }
  },

  computed: {
    ...mapGetters({
      findNFT: 'NFT/find',
      player: 'game/player',
      findPlayer: 'player/find',
      playerBattle: 'game/playerBattle'
    }),

    player1() {
      return this.findPlayer(this.battle.players[1].id)
    },

    player2() {
      return this.findPlayer(this.battle.players[2].id)
    },

    NFT1() {
      return this.findNFT(this.battle.players[1].NFT_id)
    },

    NFT2() {
      return this.findNFT(this.battle.players[2].NFT_id)
    }
  }
}
</script>
