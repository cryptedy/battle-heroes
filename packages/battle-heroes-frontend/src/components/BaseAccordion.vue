<template>
  <div class="accordion">
    <div class="accordion-trigger" @click="toggleAccordion">
      <slot name="trigger" :open="shown" />
    </div>

    <slot v-if="shown" />
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
    toggleAccordion() {
      this.shown = !this.shown
    }
  }
}
</script>
