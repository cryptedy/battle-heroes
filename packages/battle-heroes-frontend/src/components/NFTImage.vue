<template>
  <div class="nft-image" :class="{ 'is-loaded': loaded }">
    <img
      v-if="isBlankNFT"
      src="@/assets/images/blank-NFT.png"
      width="100"
      height="100"
      alt="NO IMAGE"
      :onload="onLoaded"
    />
    <img
      v-else
      :src="nft.image_url"
      width="512"
      height="512"
      :alt="nft.name"
      :onload="onLoaded"
    />

    <div class="nft-image-loading">
      <BaseSpinner />

      <img
        src="@/assets/images/blank-NFT.png"
        width="100"
        height="100"
        alt="IMAGE LOADING..."
      />
    </div>
  </div>
</template>

<script>
export default {
  name: 'NFTImage',

  props: {
    nft: {
      type: Object,
      required: false,
      default: () => ({})
    }
  },

  data() {
    return {
      loaded: false
    }
  },

  computed: {
    isBlankNFT() {
      return !Object.keys(this.nft).length > 0
    }
  },

  methods: {
    onLoaded() {
      this.$nextTick(() => {
        this.loaded = true
      })
    }
  }
}
</script>
