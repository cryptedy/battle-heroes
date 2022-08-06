<template>
  <span class="stars">
    <FontAwesomeIcon v-for="number in numbers" :key="number" icon="star" />
  </span>
</template>

<script>
export default {
  name: 'Stars',

  props: {
    stars: {
      type: Number,
      required: true
    }
  },

  computed: {
    numbers() {
      return Array.from(Array(this.stars).keys())
    }
  }
}
</script>
