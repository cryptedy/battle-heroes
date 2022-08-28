<template>
  <li class="tab-list-item" :style="styleObject">
    <slot />
  </li>
</template>

<script>
export default {
  name: 'BaseTabListItem',

  props: {
    rows: {
      type: Number,
      required: false,
      default: 1
    }
  },

  computed: {
    styleObject() {
      const width = 100 / this.rows

      return {
        width: `${width}%`
      }
    }
  }
}
</script>
