<template>
  <h1>SELECT A HERO</h1>
  <div style="padding: 16px; text-align: center">
    <img
      v-for="playerNFT in playerNFTs"
      :key="playerNFT.id"
      style="cursor: pointer"
      :src="playerNFT.image_url"
      :alt="playerNFT.name"
      width="128"
      height="128"
      @click="select(playerNFT)"
    />
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
