<template>
  <div class="splash-screen">
    <div class="splash-screen-image">
      <img src="@/assets/images/brand-logo.png" alt="Battle Heroes" />
    </div>
    <p class="splash-screen-message">
      <BaseSpinner />
      {{ message }}
    </p>
  </div>
</template>

<script>
export default {
  name: 'SplashScreen',

  props: {
    message: {
      type: String,
      default: 'Loading...'
    }
  }
}
</script>
