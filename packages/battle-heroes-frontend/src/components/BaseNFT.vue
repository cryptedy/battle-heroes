<template>
  <img :src="nft.image_url" :alt="nft.name" width="64" height="64" />

  <p>
    <span>★★★☆☆</span>
  </p>

  <p>
    <strong>{{ nft.name }}</strong>
    -
    <span style="color: red">Rank: #{{ nft.rank }}</span>
    -
    <span style="color: blue">Score: {{ nft.score }}</span>
  </p>

  <ul>
    <li>HP: {{ Math.floor(Math.random() * 255) }}</li>
    <li>ATK: {{ Math.floor(Math.random() * 255) }}</li>
    <li>DEF: {{ Math.floor(Math.random() * 255) }}</li>
    <li>AGI: {{ Math.floor(Math.random() * 255) }}</li>
    <li>TYPE: XXX</li>
  </ul>

  <base-accordion :open="false">
    <template #trigger="scopeProps">
      <a style="color: blue; cursor: pointer">
        <span v-if="scopeProps.open">▼</span>
        <span v-else>▶</span>
        Attributes
      </a>
    </template>

    <ul>
      <li v-for="attribute in nft.attributes" :key="attribute.trait_type">
        <hr />
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
  </base-accordion>
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
