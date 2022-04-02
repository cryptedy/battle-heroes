<template>
  <button class="button" :class="`is-type-${type}`" :disabled="disabled">
    <slot />
  </button>
</template>

<script>
export default {
  name: 'BaseButton',

  props: {
    type: {
      type: String,
      required: false,
      default: 'default',
      validator: value =>
        ['default', 'primary', 'warning', 'success', 'danger'].indexOf(
          value
        ) !== -1
    },

    disabled: {
      type: Boolean,
      required: false,
      default: false
    }
  }
}
</script>
