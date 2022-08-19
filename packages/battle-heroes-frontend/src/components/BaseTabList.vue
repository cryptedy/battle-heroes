<template>
  <ul class="tab-list" :class="{ 'is-space-between': spaceBetween }">
    <slot />
  </ul>
</template>

<script>
export default {
  name: 'BaseTabList',

  props: {
    spaceBetween: {
      type: Boolean,
      required: false,
      default: false
    }
  }
}
</script>
