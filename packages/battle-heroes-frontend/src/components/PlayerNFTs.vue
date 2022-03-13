<template>
  <h2>
    <strong>Pixel Heroes</strong>
  </h2>
  <p v-if="!pixelHeroes.length > 0">No data</p>
  <ul v-else>
    <li v-for="pixelHero in pixelHeroes" :key="pixelHero.token_id">
      <hr />
      <BaseNFT :nft="pixelHero" />
    </li>
  </ul>

  <h2>
    <strong>Pixel Heroes X</strong>
  </h2>
  <p v-if="!pixelHeroesX.length > 0">No data</p>
  <ul v-else>
    <li v-for="pixelHeroX in pixelHeroesX" :key="pixelHeroX.token_id">
      <hr />
      <BaseNFT :nft="pixelHeroX" />
    </li>
  </ul>
</template>

<script>
import { mapGetters } from 'vuex'
import { COLLECTION_ID } from '@/utils/constants'

export default {
  name: 'PlayerNFTs',

  computed: {
    ...mapGetters({
      byPlayer: 'NFT/byPlayer',
      player: 'player/userPlayer'
    }),

    pixelHeroes() {
      return this.byPlayer(COLLECTION_ID.PIXEL_HEROES, this.player)
    },

    pixelHeroesX() {
      return this.byPlayer(COLLECTION_ID.PIXEL_HEROES_X, this.player)
    }
  }
}
</script>
