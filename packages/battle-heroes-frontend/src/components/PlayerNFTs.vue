<template>
  <h2>
    <strong>Pixel Heroes</strong>
  </h2>
  <p v-if="!pixelHeroes.length > 0">No data</p>
  <ul v-else>
    <li v-for="pixelHero in pixelHeroes" :key="pixelHero.token_id">
      <p>
        <strong>#{{ pixelHero.token_id }}</strong>
      </p>
      <img
        :src="pixelHero.image_url"
        :alt="pixelHero.name"
        width="64"
        height="64"
      />
      <ul>
        <li
          v-for="attribute in pixelHero.attributes"
          :key="attribute.trait_type"
        >
          {{ attribute.trait_type }}: {{ attribute.value }}
        </li>
      </ul>
      <hr />
    </li>
  </ul>

  <h2>
    <strong>Pixel Heroes X</strong>
  </h2>
  <p v-if="!pixelHeroesX.length > 0">No data</p>
  <ul v-else>
    <li v-for="pixelHeroX in pixelHeroesX" :key="pixelHeroX.token_id">
      <p>
        <strong>#{{ pixelHeroX.token_id }}</strong>
      </p>
      <img
        :src="pixelHeroX.image_url"
        :alt="pixelHeroX.name"
        width="64"
        height="64"
      />
      <ul>
        <li
          v-for="attributeX in pixelHeroX.attributes"
          :key="attributeX.trait_type"
        >
          {{ attributeX.trait_type }}: {{ attributeX.value }}
        </li>
      </ul>
      <hr />
    </li>
  </ul>
</template>

<script>
import { mapGetters } from 'vuex'
import { COLLECTION } from '@/utils/constants'

export default {
  name: 'PlayerNFTs',

  computed: {
    ...mapGetters({
      byPlayer: 'NFT/byPlayer',
      player: 'player/userPlayer'
    }),

    pixelHeroes() {
      return this.byPlayer(COLLECTION.PIXEL_HEROES, this.player)
    },

    pixelHeroesX() {
      return this.byPlayer(COLLECTION.PIXEL_HEROES_X, this.player)
    }
  }
}
</script>
