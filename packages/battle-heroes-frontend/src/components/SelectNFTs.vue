<template>
  <h1>SELECT A HERO</h1>
  <div style="padding: 16px; text-align: center">
    <img
      v-for="NFT in NFTs"
      :key="NFT.token_id"
      style="cursor: pointer"
      :src="NFT.image_url"
      :alt="NFT.name"
      width="128"
      height="128"
      @click="select(NFT)"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { COLLECTION_ID } from '@/utils/constants'

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
      byPlayer: 'NFT/byPlayer'
    }),

    pixelHeroes() {
      return this.byPlayer(COLLECTION_ID.PIXEL_HEROES, this.player)
    },

    pixelHeroesX() {
      return this.byPlayer(COLLECTION_ID.PIXEL_HEROES_X, this.player)
    },

    NFTs() {
      return this.pixelHeroes.concat(this.pixelHeroesX)
    }
  },

  methods: {
    select(NFT) {
      this.$emit('select', NFT)
    }
  }
}
</script>
