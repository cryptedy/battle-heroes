<template>
  <BaseEmpty v-if="!playerNFTs.length > 0" text="NO NFTs" />

  <BaseList v-else class="player-nft-list">
    <PlayerNFTListItem
      v-for="playerNFT in playerNFTs"
      :key="playerNFT.id"
      :nft="playerNFT"
    />
  </BaseList>
</template>

<script>
import { mapGetters } from 'vuex'
import PlayerNFTListItem from '@/components/PlayerNFTListItem'

export default {
  name: 'PlayerNFTList',

  components: {
    PlayerNFTListItem
  },

  props: {
    player: {
      type: Object,
      required: true
    }
  },

  computed: {
    ...mapGetters({
      NFTsByPlayer: 'NFT/byPlayer'
    }),

    playerNFTs() {
      return this.NFTsByPlayer(this.player)
    }
  }
}
</script>
