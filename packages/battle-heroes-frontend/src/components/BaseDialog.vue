<template>
  <div
    v-if="$slots.trigger"
    ref="trigger"
    class="dialog-trigger"
    @click="openDialog"
  >
    <slot name="trigger" :open="shown" />
  </div>

  <teleport to="#teleport">
    <div
      v-if="overlayShown || dialogContentShown || dialogShown"
      class="dialog"
    >
      <BaseOverlay :show="overlayShown" appear @click="closeDialog" />

      <transition name="dialog-content">
        <div v-if="dialogContentShown" class="dialog-content">
          {{ overlayShown }} - {{ dialogContentShown }} - {{ dialogShown }}

          <span v-if="$slots.trigger || programmatic">
            <button @click="closeDialog">CLOSE</button>
          </span>

          <template v-if="programmatic"> DATA </template>

          <slot v-else />
        </div>
      </transition>
    </div>
  </teleport>
</template>

<script>
export default {
  name: 'BaseDialog',

  props: {
    open: {
      type: Boolean,
      required: false,
      default: false
    },

    programmatic: {
      type: Boolean,
      required: false,
      default: false
    }
  },

  emits: ['open', 'close'],

  data() {
    return {
      processing: false,
      shown: false,
      dialogShown: false,
      dialogContentShown: false,
      overlayShown: false
    }
  },

  watch: {
    // eslint-disable-next-line no-unused-vars
    open(value, oldValue) {
      this.shown = value
    },

    // eslint-disable-next-line no-unused-vars
    shown(value, oldValue) {
      this.processing = true

      if (value) {
        document.body.classList.add('has-dialog')

        this.dialogShown = true
        this.overlayShown = true

        setTimeout(() => {
          this.dialogContentShown = true
          this.processing = false
        }, 225 / 2)
      } else {
        document.body.classList.remove('has-dialog')

        this.dialogContentShown = false

        setTimeout(() => {
          this.overlayShown = false
          this.dialogShown = false
          this.processing = false
        }, 225)
      }
    }
  },

  mounted() {
    this.shown = this.open
  },

  methods: {
    openDialog() {
      if (this.processing) return

      this.shown = true

      this.$emit('open')
    },

    closeDialog() {
      if (this.processing) return

      this.shown = false

      this.$emit('close')
    }
  }
}
</script>

<style lang="scss">
.dialog {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  outline: none;
  color: color(primary);
  z-index: z-index(dialog);

  &-trigger {
    display: inline-block;
    user-select: none;
  }

  &-content {
    overflow-y: auto;
    position: relative;
    background-color: palette(grey, 0);
    width: 80%;
    max-height: 90%;

    &-enter-active,
    &-leave-active {
      transition: all 225ms;
    }
    &-enter-from,
    &-leave-to {
      opacity: 0;
      transform: translateY(-12px);
    }
  }
}
</style>
