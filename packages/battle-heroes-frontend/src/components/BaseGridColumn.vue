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

<style lang="scss">
.grid-column {
  float: left;
  width: 100%;
  padding: 8px;
  &.column-1 {
    width: 8.33333333333%;
  }
  &.column-2 {
    width: 16.6666666667%;
  }
  &.column-3 {
    width: 25%;
  }
  &.column-4 {
    width: 33.3333333333%;
  }
  &.column-5 {
    width: 41.6666666667%;
  }
  &.column-6 {
    width: 50%;
  }
  &.column-7 {
    width: 58.3333333333%;
  }
  &.column-8 {
    width: 66.6666666667%;
  }
  &.column-9 {
    width: 75%;
  }
  &.column-10 {
    width: 83.3333333333%;
  }
  &.column-11 {
    width: 91.6666666667%;
  }
  &.column-12 {
    width: 100%;
  }
}
</style>
