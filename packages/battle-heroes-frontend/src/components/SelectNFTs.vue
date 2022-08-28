<template>
  <BaseEmpty v-if="!playerNFTs.length > 0" text="NO NFTs" />

  <div v-else class="nft">
    <ul class="nft-list">
      <li
        v-for="playerNFT in playerNFTs"
        :key="playerNFT.id"
        class="nft-list-item"
      >
        <NFTImage :nft="playerNFT" @click="select(playerNFT)" />
      </li>
    </ul>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import NFTImage from '@/components/NFTImage'

export default {
  name: 'SelectNFTs',

  components: {
    NFTImage
  },

  props: {
    player: {
      type: Object,
      required: true
    }
  },

  emits: ['select'],

  computed: {
    ...mapGetters({
      NFTsByPlayer: 'NFT/byPlayer'
    }),

    playerNFTs() {
      return this.NFTsByPlayer(this.player)
    }
  },

  methods: {
    select(NFT) {
      this.$emit('select', NFT)
    }
  }
}
</script>
