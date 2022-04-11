<template>
  <BaseEmpty v-if="!playerNFTs.length > 0" text="NO NFTs" />

  <div v-else class="nft">
    <ul class="nft-list">
      <li
        v-for="playerNFT in playerNFTs"
        :key="playerNFT.id"
        class="nft-list-item"
      >
        <div class="nft-image">
          <img
            :src="playerNFT.image_url"
            :alt="playerNFT.name"
            width="512"
            height="512"
            style="cursor: pointer"
            @click="select(playerNFT)"
          />
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'SelectNFTs',

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
