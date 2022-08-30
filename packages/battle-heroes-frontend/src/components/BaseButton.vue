<template>
  <button
    class="button"
    :class="[`is-shade-${shade}`, `is-type-${type}`]"
    :disabled="disabled"
  >
    <slot />
  </button>
</template>

<script>
export default {
  name: 'BaseButton',

  props: {
    shade: {
      type: String,
      required: false,
      default: 'light',
      validator: value => ['dark', 'light'].indexOf(value) !== -1
    },

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
