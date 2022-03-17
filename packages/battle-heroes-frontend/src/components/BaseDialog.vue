<template>
  <span
    v-if="$slots.trigger"
    ref="trigger"
    class="dialog-trigger"
    @click="openDialog"
  >
    <slot name="trigger" :open="shown" />
  </span>

  <teleport to="#teleport">
    <div v-if="overlayShown || dialogShown" class="dialog">
      <BaseOverlay :show="overlayShown" @click="closeDialog" />

      <transition name="dialog">
        <div v-if="dialogShown" class="dialog-content">
          <slot name="default" />
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
    }
  },

  emits: ['open', 'close'],

  data() {
    return {
      shown: false,
      dialogShown: false,
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
      if (value) {
        document.body.classList.add('has-dialog')

        this.overlayShown = true

        setTimeout(() => {
          this.dialogShown = true
        }, 100)
      } else {
        document.body.classList.remove('has-dialog')

        this.dialogShown = false

        setTimeout(() => {
          this.overlayShown = false
        }, 100)
      }
    }
  },

  methods: {
    openDialog() {
      this.shown = true

      this.$emit('open')
    },

    closeDialog() {
      this.shown = false

      this.$emit('close')
    }
  }
}
</script>
