<template>
  <BaseEmpty v-if="!playerNFTs.length > 0" />

  <ul v-else>
    <li v-for="playerNFT in playerNFTs" :key="playerNFT.id">
      <hr />
      <BaseNFT :nft="playerNFT" />
    </li>
  </ul>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'PlayerNFTs',

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
