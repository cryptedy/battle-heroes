<template>
  <BaseListItem class="nft-list-item">
    <BaseNFT :nft="nft" />
  </BaseListItem>
</template>

<script>
export default {
  name: 'NFTListItem',

  props: {
    nft: {
      type: Object,
      required: true
    }
  }
}
</script>
