<template>
  <BaseDialog :title="nft.name">
    <template #trigger>
      <div class="nft">
        <NFTImage :nft="nft" />

        <h1 class="nft-name">
          {{ nft.name }}
        </h1>

        <Stars :stars="nft.stars" />
        {{ nft.rank }}
      </div>
    </template>

    <div class="nft">
      <NFTImage :nft="nft" />

      <h1 class="nft-name">
        {{ nft.name }}
      </h1>

      <Stars :stars="nft.stars" />
      <BaseNFTRarity :nft="nft" />
      <BaseNFTAttributes :nft="nft" />
    </div>
  </BaseDialog>
</template>

<script>
import Stars from '@/components/Stars'
import NFTImage from '@/components/NFTImage'
import BaseNFTRarity from '@/components/BaseNFTRarity'
import BaseNFTAttributes from '@/components/BaseNFTAttributes'

export default {
  name: 'BaseNFT',

  components: {
    Stars,
    NFTImage,
    BaseNFTRarity,
    BaseNFTAttributes
  },

  props: {
    nft: {
      type: Object,
      required: true
    }
  }
}
</script>
