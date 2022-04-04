<template>
  <BaseListItem class="player-nft-list-item">
    <BaseNFT :nft="nft" />
  </BaseListItem>
</template>

<script>
export default {
  name: 'PlayerNFTListItem',

  props: {
    nft: {
      type: Object,
      required: true
    }
  }
}
</script>
