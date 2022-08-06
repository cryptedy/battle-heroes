<template>
  <div class="nft-meta">
    <ul class="nft-meta-list">
      <li class="nft-meta-list-item">
        <p class="nft-meta-key">RANK:</p>
        <p class="nft-meta-value">
          {{ nft.rank }}
        </p>
      </li>
      <li class="nft-meta-list-item">
        <p class="nft-meta-key">RARITY SCORE:</p>
        <p class="nft-meta-value">
          {{ nft.score }}
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
