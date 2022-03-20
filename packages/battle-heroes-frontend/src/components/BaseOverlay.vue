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

<style lang="scss">
.overlay {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  overflow-x: hidden;
  overflow-y: auto;
  background-color: rgba(0, 0, 0, 0.5);
  pointer-events: auto;
  touch-action: none;
  // z-index: z-index(overlay);

  &-enter-active,
  &-leave-active {
    transition: opacity 225ms cubic-bezier(0, 0, 0.2, 1) 0ms;
  }
  &-enter-from,
  &-leave-to {
    opacity: 0;
  }
}
</style>
