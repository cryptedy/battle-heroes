<template>
  <button class="button" :disabled="disabled">
    <slot />
  </button>
</template>

<script>
export default {
  name: 'BaseButton',

  props: {
    disabled: {
      type: Boolean,
      required: false,
      default: false
    }
  }
}
</script>
