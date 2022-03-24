<template>
  <div class="splash-screen">
    <div v-if="randomNFT" class="splash-screen-content">
      <p style="font-size: 18px">
        {{ randomNFT.name }}
      </p>

      <p>
        <FontAwesomeIcon icon="star" />
        <FontAwesomeIcon icon="star" />
        <FontAwesomeIcon icon="star" />
      </p>

      <div class="splash-screen-image">
        <img
          :src="randomNFT.image_url"
          :alt="randomNFT.name"
          width="512"
          height="512"
        />
      </div>

      <ul>
        <li
          v-for="attribute in randomNFT.attributes"
          :key="attribute.trait_type"
        >
          {{ attribute.trait_type }}
          :
          {{ attribute.value }}
        </li>
      </ul>
    </div>

    <p class="splash-screen-message">
      <BaseSpinner />
      {{ message }}
    </p>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'SplashScreen',

  props: {
    message: {
      type: String,
      default: 'Loading...'
    }
  },

  computed: {
    ...mapGetters({
      NFTs: 'NFT/all',
      NFTsCount: 'NFT/count'
    }),

    randomNFT() {
      if (!this.NFTsCount > 0) return

      const min = Math.ceil(1)
      const max = Math.floor(this.NFTsCount)
      const id = Math.floor(Math.random() * (max - min) + min)

      return this.NFTs.find(NFT => NFT.id === id)
    }
  }
}
</script>
