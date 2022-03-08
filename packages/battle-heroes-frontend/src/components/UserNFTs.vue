<template>
  <h2>
    <strong>Pixel Heroes</strong>
  </h2>
  <p v-if="!userPixelHeroes.length > 0">No data</p>
  <ul v-else>
    <li v-for="userPixelHero in userPixelHeroes" :key="userPixelHero.token_id">
      <p>
        <strong>#{{ userPixelHero.token_id }}</strong>
      </p>
      <img
        :src="userPixelHero.image_url"
        :alt="userPixelHero.name"
        width="64"
        height="64"
      />
      <ul>
        <li
          v-for="attribute in userPixelHero.attributes"
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
  <p v-if="!userPixelHeroesX.length > 0">No data</p>
  <ul v-else>
    <li
      v-for="userPixelHeroX in userPixelHeroesX"
      :key="userPixelHeroX.token_id"
    >
      <p>
        <strong>#{{ userPixelHeroX.token_id }}</strong>
      </p>
      <img
        :src="userPixelHeroX.image_url"
        :alt="userPixelHeroX.name"
        width="64"
        height="64"
      />
      <ul>
        <li
          v-for="attributeX in userPixelHeroX.attributes"
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
  name: 'UserNFTs',

  computed: {
    ...mapGetters({
      userNFTs: 'NFT/userNFTs'
    }),

    userPixelHeroes() {
      return this.userNFTs(COLLECTION.PIXEL_HEROES)
    },

    userPixelHeroesX() {
      return this.userNFTs(COLLECTION.PIXEL_HEROES_X)
    }
  }
}
</script>
