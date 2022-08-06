<template>
  <div class="random-nft">
    <transition name="random-nft-content" appear>
      <div v-if="randomNFT" class="random-nft-content">
        <p class="random-nft-name">
          {{ randomNFT.name }}
        </p>

        <div class="random-nft-rarity">
          <Stars :stars="randomNFT.stars" />

          <BaseNFTRarity :nft="randomNFT" />
        </div>

        <div class="random-nft-image" :class="{ 'is-loaded': imageLoaded }">
          <img
            :onload="onImageLoad"
            :src="randomNFT.image_url"
            :alt="randomNFT.name"
            width="512"
            height="512"
          />
        </div>

        <div class="random-nft-attributes">
          <BaseNFTAttributes :nft="randomNFT" />
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Stars from '@/components/Stars'
import BaseNFTRarity from '@/components/BaseNFTRarity'
import BaseNFTAttributes from '@/components/BaseNFTAttributes'

const getRandomArbitrary = (min, max) => {
  return Math.floor(Math.random() * (max - min) + min)
}

export default {
  name: 'RandomNFT',

  components: {
    Stars,
    BaseNFTRarity,
    BaseNFTAttributes
  },

  intervalId: null,

  data() {
    return {
      min: 1,
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

      const min = this.min
      const max = Math.floor(this.NFTsCount)
      const id = Math.floor(Math.random() * (max - min) + min)

      return this.NFTs.find(NFT => NFT.id === id)
    }
  },

  mounted() {
    this.$options.intervalId = setInterval(() => {
      this.min = getRandomArbitrary(1, this.NFTsCount)
    }, 10000)
  },

  beforeUnmount() {
    if (this.$options.intervalId) {
      clearInterval(this.$options.intervalId)
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
