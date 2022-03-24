<template>
  <div class="splash-screen">
    <transition name="splash-screen-content" appear>
      <div v-if="randomNFT" class="splash-screen-content">
        <p style="font-size: 18px">
          {{ randomNFT.name }}
        </p>

        <p>
          <FontAwesomeIcon icon="star" />
          <FontAwesomeIcon icon="star" />
          <FontAwesomeIcon icon="star" />
          RANK: {{ randomNFT.rank }} - SCORE: {{ randomNFT.score }}
        </p>

        <div class="splash-screen-image" :class="{ 'is-loaded': imageLoaded }">
          <img
            :onload="onImageLoad"
            :src="randomNFT.image_url"
            :alt="randomNFT.name"
            width="512"
            height="512"
          />
        </div>

        <ul class="splash-screen-text">
          <li
            v-for="attribute in randomNFT.attributes"
            :key="attribute.trait_type"
          >
            <span class="splash-screen-text-secondary">
              {{ attribute.trait_type }}
            </span>
            <span class="splash-screen-text-primary">
              {{ attribute.value }}
            </span>
          </li>
        </ul>
      </div>
    </transition>

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

  data() {
    return {
      imageLoaded: false
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
  },

  methods: {
    onImageLoad() {
      this.$nextTick(() => {
        this.imageLoaded = true
      })
    }
  }
}
</script>
