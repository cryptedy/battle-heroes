<template>
  <div class="nft-meta">
    <ul class="nft-meta-list">
      <li
        v-for="attribute in nft.attributes"
        :key="attribute.trait_type"
        class="nft-meta-list-item"
      >
        <p class="nft-meta-key">{{ attribute.trait_type.toUpperCase() }}:</p>
        <p class="nft-meta-value">
          {{ attribute.value }}
        </p>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'BaseNFTMeta',

  props: {
    nft: {
      type: Object,
      required: true
    }
  }
}
</script>
