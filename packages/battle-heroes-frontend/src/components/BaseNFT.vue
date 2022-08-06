<template>
  <BaseDialog :title="nft.name">
    <template #trigger>
      <div class="nft">
        <div class="nft-image">
          <img :src="nft.image_url" :alt="nft.name" width="512" height="512" />
        </div>

        <h1 class="nft-name">
          {{ nft.name }}
        </h1>

        <Stars :stars="nft.stars" />
        {{ nft.rank }}
      </div>
    </template>

    <div class="nft">
      <div class="nft-image">
        <img :src="nft.image_url" :alt="nft.name" width="512" height="512" />
      </div>

      <h1 class="nft-name">
        {{ nft.name }}
      </h1>

      <Stars :stars="nft.stars" />
      <BaseNFTRarity :nft="nft" />
      <BaseNFTAttributes :nft="nft" />

      <BattleCreateButton :nft="nft" />
    </div>
  </BaseDialog>
</template>

<script>
import Stars from '@/components/Stars'
import BaseNFTRarity from '@/components/BaseNFTRarity'
import BaseNFTAttributes from '@/components/BaseNFTAttributes'
import BattleCreateButton from '@/components/BattleCreateButton'

export default {
  name: 'BaseNFT',

  components: {
    Stars,
    BaseNFTRarity,
    BaseNFTAttributes,
    BattleCreateButton
  },

  props: {
    nft: {
      type: Object,
      required: true
    }
  }
}
</script>
