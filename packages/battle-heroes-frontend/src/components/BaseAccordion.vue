<template>
  <span @click="toggle">
    <slot name="trigger" :show="shown" />
  </span>
  <slot v-if="shown" name="contents" />
</template>

<script>
export default {
  name: 'BaseAccordion',

  props: {
    open: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      shown: this.open
    }
  },

  methods: {
    toggle() {
      this.shown = !this.shown
    }
  }
}
</script>
