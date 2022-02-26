<template>
  <h1>
    <RouterLink :to="{ name: 'home' }">
      {{ appTitle }}
    </RouterLink>
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
