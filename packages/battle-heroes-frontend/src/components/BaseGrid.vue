<template>
  <div class="grid">
    <slot />
  </div>
</template>

<script>
export default {
  name: 'BaseGrid'
}
</script>

<style lang="scss">
.grid {
  @include clearfix;
  padding: 8px;
}
</style>
