<template>
  <div class="health-bar">
    <div
      class="health-bar-progress"
      :class="{ 'has-damage': hasDamage }"
      :style="styleObject"
    ></div>
  </div>
</template>

<script>
export default {
  name: 'HealthBar',

  props: {
    maxHp: {
      type: Number,
      required: true
    },

    hp: {
      type: Number,
      required: true
    }
  },

  computed: {
    styleObject() {
      return {
        width: `${(this.hp / this.maxHp) * 100}%`
      }
    },

    hasDamage() {
      return this.hp < this.maxHp
    }
  }
}
</script>
