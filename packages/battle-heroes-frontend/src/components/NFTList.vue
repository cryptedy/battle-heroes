<template>
  <BaseEmpty v-if="!playerNFTs.length > 0" text="NO NFTs" />

  <BaseList v-else class="nft-list">
    <NFTListItem
      v-for="playerNFT in playerNFTs"
      :key="playerNFT.id"
      :nft="playerNFT"
    />
  </BaseList>
</template>

<script>
import { mapGetters } from 'vuex'
import NFTListItem from '@/components/NFTListItem'

export default {
  name: 'NFTList',

  components: {
    NFTListItem
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
