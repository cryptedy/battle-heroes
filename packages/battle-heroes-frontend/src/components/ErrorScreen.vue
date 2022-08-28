<template>
  <teleport to="#teleport">
    <div class="error-screen">
      <p class="error-screen-message">{{ message }}</p>

      <div v-if="$slots.default" class="error-screen-content">
        <slot />
      </div>
    </div>
  </teleport>
</template>

<script>
export default {
  name: 'ErrorScreen',

  props: {
    message: {
      type: String,
      default: 'an error occurred'
    }
  }
}
</script>
