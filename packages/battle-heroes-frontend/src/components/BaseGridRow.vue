<template>
  <div class="grid-row">
    <slot />
  </div>
</template>

<script>
export default {
  name: 'BaseGridRow'
}
</script>

<style lang="scss">
.grid {
  @include clearfix;
  padding: 8px;
}
</style>
