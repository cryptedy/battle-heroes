<template>
  <li class="list-item">
    <slot />
  </li>
</template>

<script>
export default {
  name: 'BaseListItem'
}
</script>

<style lang="scss">
.list-item {
  border-bottom: 1px solid color(divider, light);
  &:last-child {
    border-bottom: none;
  }
}
</style>
