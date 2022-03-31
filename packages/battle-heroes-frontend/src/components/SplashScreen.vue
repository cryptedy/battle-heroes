<template>
  <div class="splash-screen">
    <div v-if="$slots.default" class="splash-screen-content">
      <slot />
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
