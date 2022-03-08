<template>
  <h1>
    <router-link :to="{ name: 'home' }">
      {{ appTitle }}
    </router-link>
  </h1>

  <p>Battle Heroes is a game based on Pixel Heroes NFT collections.</p>
</template>

<script>
const appTitle = process.env.VUE_APP_TITLE

export default {
  name: 'AppHeader',

  data() {
    return {
      appTitle: appTitle
    }
  }
}
</script>
