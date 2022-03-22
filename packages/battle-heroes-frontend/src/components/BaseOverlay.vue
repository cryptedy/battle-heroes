<template>
  <transition name="overlay">
    <div v-if="show" class="overlay">
      <slot />
    </div>
  </transition>
</template>

<script>
export default {
  name: 'BaseOverlay',

  props: {
    show: {
      type: Boolean,
      required: true,
      default: false
    }
  }
}
</script>
