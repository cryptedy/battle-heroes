<template>
  <div class="grid-column" :class="`column-${column}`">
    <slot />
  </div>
</template>

<script>
export default {
  name: 'BaseGridColumn',

  props: {
    column: {
      type: Number,
      default: 12,
      required: false,
      validator(value) {
        return value <= 12
      }
    }
  }
}
</script>
