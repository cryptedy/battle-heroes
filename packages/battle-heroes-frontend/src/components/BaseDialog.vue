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
          <header>
            <template v-if="$slots.trigger || programmatic">
              <BaseButton @click="closeDialog">CLOSE</BaseButton>
            </template>
          </header>

          <template v-if="programmatic">
            DATA

            <BaseButton @click="cancelDialog"> CANCEL </BaseButton>

            <BaseButton :disabled="confirmLoading" @click="confirmDialog">
              <BaseSpinner v-if="confirmLoading" />
              OK
            </BaseButton>
          </template>

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
    },

    timeout: {
      type: Number,
      required: false,
      default: 0
    },

    onConfirm: {
      type: Function,
      required: false,
      default: () => {}
    },

    onCancel: {
      type: Function,
      required: false,
      default: () => {}
    },

    onTimeout: {
      type: Function,
      required: false,
      default: () => {}
    }
  },

  emits: ['open', 'close'],

  data() {
    return {
      shown: false,
      dialogShown: false,
      dialogContentShown: false,
      overlayShown: false,
      attemptingToOpen: false,
      attemptingToClose: false,
      confirmLoading: false,
      timeoutId: null
    }
  },

  computed: {
    attempting() {
      return this.attemptingToOpen || this.attemptingToClose
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
        this.attemptingToOpen = true

        document.body.classList.add('has-dialog')

        if (this.timeout > 0) {
          this.setCloseTimeout()
        }

        this.dialogShown = true
        this.overlayShown = true

        setTimeout(() => {
          this.dialogContentShown = true
          this.attemptingToOpen = false
        }, 225 / 2)
      } else {
        this.attemptingToClose = true

        document.body.classList.remove('has-dialog')

        if (this.timeout > 0) {
          this.clearCloseTimeout()
        }

        this.dialogContentShown = false

        setTimeout(() => {
          this.overlayShown = false
          this.dialogShown = false
          this.attemptingToClose = false
        }, 225)
      }
    }
  },

  mounted() {
    this.shown = this.open
  },

  methods: {
    openDialog() {
      if (this.attempting) return

      this.shown = true

      this.$emit('open')
    },

    closeDialog() {
      if (this.attempting) return

      this.shown = false

      this.$emit('close')
    },

    cancelDialog() {
      this.onCancel.apply(null, arguments)

      this.closeDialog()
    },

    async confirmDialog() {
      const confirmFunction = this.onConfirm.bind(null, arguments)

      await confirmFunction(this)

      this.closeDialog()
    },

    setCloseTimeout() {
      this.timeoutId = setTimeout(() => {
        this.onTimeout.apply(null, arguments)

        this.closeDialog()
      }, this.timeout)
    },

    clearCloseTimeout() {
      clearTimeout(this.timeoutId)

      this.timeoutId = null
    }
  }
}
</script>
