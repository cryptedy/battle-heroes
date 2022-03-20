<template>
  <ul class="list">
    <slot />
  </ul>
</template>

<script>
export default {
  name: 'BaseList'
}
</script>

<style lang="scss">
.list {
  padding-top: 4px;
  padding-bottom: 4px;
  border-bottom: 1px solid color(divider, light);
}
</style>
