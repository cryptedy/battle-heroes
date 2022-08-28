<template>
  <teleport to="#teleport">
    <div class="splash-screen">
      <p class="splash-screen-message">
        <BaseSpinner />
        {{ message }}
      </p>

      <div v-if="$slots.default" class="splash-screen-content">
        <slot />
      </div>
    </div>
  </teleport>
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
