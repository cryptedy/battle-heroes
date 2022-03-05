<template>
  <div ref="accordion">
    <div @click="toggle">
      <slot name="trigger" :show="shown" />
    </div>
    <slot v-if="shown" name="contents" />
  </div>
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
    hide() {
      this.shown = false
    },

    show() {
      this.shown = true
    },

    toggle() {
      this.shown = !this.shown
    }
  }
}
</script>
