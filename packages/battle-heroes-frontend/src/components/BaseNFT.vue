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

        <div class="nft-meta">
          <span class="nft-rarity">
            <FontAwesomeIcon icon="star" />
            <FontAwesomeIcon icon="star" />
            <FontAwesomeIcon icon="star" />
          </span>

          {{ nft.rank }}
        </div>
      </div>
    </template>

    <div class="nft">
      <div class="nft-image">
        <img :src="nft.image_url" :alt="nft.name" width="512" height="512" />
      </div>

      <h1 class="nft-name">
        {{ nft.name }}
      </h1>

      <div class="nft-meta">
        <span class="nft-rarity">
          <FontAwesomeIcon icon="star" />
          <FontAwesomeIcon icon="star" />
          <FontAwesomeIcon icon="star" />
        </span>

        <p>RANK: {{ nft.rank }}</p>

        <p>SCORE: {{ nft.score }}</p>
      </div>
    </div>

    <ul class="nft-attribute-list">
      <li
        v-for="attribute in nft.attributes"
        :key="attribute.trait_type"
        class="nft-attribute-list-item"
      >
        <dl class="nft-attribute">
          <dt class="nft-attribute-type">{{ attribute.trait_type }}</dt>
          <dd class="nft-attribute-value">{{ attribute.value }}</dd>
        </dl>
      </li>
    </ul>
  </BaseDialog>
</template>

<script>
export default {
  name: 'BaseNFT',

  props: {
    nft: {
      type: Object,
      required: true
    }
  }
}
</script>
