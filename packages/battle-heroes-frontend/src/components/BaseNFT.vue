<template>
  <div class="nft">
    <h1 class="nft-name">
      {{ nft.name }}
    </h1>

    <div class="nft-meta">
      <span class="nft-rarity">
        <FontAwesomeIcon icon="star" />
        <FontAwesomeIcon icon="star" />
        <FontAwesomeIcon icon="star" />
      </span>

      {{ nft.rank }} - {{ nft.score }}
    </div>

    <div class="nft-image">
      <img :src="nft.image_url" :alt="nft.name" width="512" height="512" />
    </div>

    <!-- <div class="nft-attributes">
      <ul>
        <li v-for="attribute in nft.attributes" :key="attribute.trait_type">
          <p>
            <strong>{{ attribute.trait_type }}</strong>
            =>
            <strong>{{ attribute.value }}</strong>
          </p>
          <p>
            <span style="color: blue"> Score: +{{ attribute.score }} </span>
            -
            <span style="color: red"> {{ attribute.rarity }}% </span>
            have this trait
          </p>
        </li>
      </ul>
    </div> -->
  </div>
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
