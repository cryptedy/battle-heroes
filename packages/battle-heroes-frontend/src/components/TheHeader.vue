<template>
  <header class="header">
    <h1 class="brand-text">
      <router-link :to="{ name: 'index' }"> Battle Heroes </router-link>
    </h1>

    <p class="login-text">
      <router-link :to="{ name: 'login' }"> LOGIN </router-link>
    </p>
  </header>
</template>

<script>
export default {
  name: 'TheHeader'
}
</script>
