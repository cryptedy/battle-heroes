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
      <BaseOverlay :show="overlayShown" appear @click="dismissDialog" />

      <transition name="dialog-content">
        <div
          v-if="dialogContentShown"
          class="dialog-content"
          :class="{ 'close-attempting': closeAttempting }"
        >
          <header class="dialog-header">
            <h1 class="dialog-header-title">
              {{ title }}
            </h1>

            <div class="dialog-header-actions">
              <button @click="dismissDialog">
                <FontAwesomeIcon icon="xmark" />
              </button>
            </div>
          </header>

          <main
            class="dialog-body"
            :class="{
              'has-padding-top': paddingTop,
              'has-padding-right': paddingRight,
              'has-padding-bottom': paddingBottom,
              'has-padding-left': paddingLeft
            }"
          >
            <template v-if="message">
              <!-- eslint-disable-next-line vue/no-v-html -->
              <div v-html="message" />
            </template>

            <slot v-else />
          </main>

          <footer v-if="programmatic" class="dialog-footer">
            <BaseButton @click="cancelDialog"> {{ cancelLabel }} </BaseButton>

            <BaseButton
              :disabled="confirmLoading"
              type="primary"
              @click="confirmDialog"
            >
              <BaseSpinner v-if="confirmLoading" />
              {{ confirmLabel }}
            </BaseButton>
          </footer>
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

    title: {
      type: String,
      required: true
    },

    message: {
      type: String,
      default: '',
      required: false
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

    dismissable: {
      type: Boolean,
      required: false,
      default: true
    },

    width: {
      type: String,
      required: false,
      default: '100%'
    },

    height: {
      type: String,
      required: false,
      default: '100%'
    },

    paddingTop: {
      type: Boolean,
      required: false,
      default: true
    },

    paddingRight: {
      type: Boolean,
      required: false,
      default: true
    },

    paddingBottom: {
      type: Boolean,
      required: false,
      default: true
    },

    paddingLeft: {
      type: Boolean,
      required: false,
      default: true
    },

    confirmLabel: {
      type: String,
      required: false,
      default: 'OK'
    },

    cancelLabel: {
      type: String,
      required: false,
      default: 'CANCEL'
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
      closeAttempting: false,
      attemptingToOpen: false,
      attemptingToClose: false,
      confirmLoading: false,
      timeoutId: null
    }
  },

  computed: {
    attempting() {
      return this.attemptingToOpen || this.attemptingToClose
    },

    drawerContentStyleObject() {
      return {
        width: this.width,
        height: this.height
      }
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
    dismissDialog() {
      if (this.dismissable) {
        this.closeDialog()
      } else {
        this.closeAttempting = true

        setTimeout(() => {
          this.closeAttempting = false
        }, 100)
      }
    },

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
