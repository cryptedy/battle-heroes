<template>
  <div v-if="$slots.trigger" class="drawer-trigger" @click="openDrawer">
    <slot name="trigger" :open="shown" />
  </div>

  <teleport to="#teleport">
    <div
      v-if="overlayShown || drawerContentShown || drawerShown"
      class="drawer"
    >
      <BaseOverlay :show="overlayShown" appear @click="dismissDrawer" />

      <transition :name="transitionName">
        <div
          v-if="drawerContentShown"
          class="drawer-content"
          :class="[
            `is-direction-${direction}`,
            { 'close-attempting': closeAttempting }
          ]"
          :style="drawerContentStyleObject"
        >
          <header class="drawer-header">
            <h1 class="drawer-header-title">
              {{ title }}
            </h1>

            <div class="drawer-header-actions">
              <button @click="dismissDrawer">
                <FontAwesomeIcon icon="xmark" />
              </button>
            </div>
          </header>

          <main
            class="drawer-body"
            :class="{
              'has-padding-top': paddingTop,
              'has-padding-right': paddingRight,
              'has-padding-bottom': paddingBottom,
              'has-padding-left': paddingLeft
            }"
          >
            <slot />
          </main>
        </div>
      </transition>
    </div>
  </teleport>
</template>

<script>
export default {
  name: 'BaseDrawer',

  props: {
    open: {
      type: Boolean,
      required: false,
      default: false
    },

    direction: {
      type: String,
      required: false,
      default: 'left',
      validator: value =>
        ['top', 'right', 'left', 'bottom'].indexOf(value) !== -1
    },

    title: {
      type: String,
      required: true
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
    }
  },

  emits: ['open', 'close'],

  data() {
    return {
      shown: false,
      drawerShown: false,
      drawerContentShown: false,
      overlayShown: false,
      closeAttempting: false,
      attemptingToOpen: false,
      attemptingToClose: false
    }
  },

  computed: {
    attempting() {
      return this.attemptingToOpen || this.attemptingToClose
    },

    transitionName() {
      return `drawer-content-${this.direction}`
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

        document.body.classList.add('has-drawer')

        this.drawerShown = true
        this.overlayShown = true

        setTimeout(() => {
          this.drawerContentShown = true
          this.attemptingToOpen = false
        }, 225 / 2)
      } else {
        this.attemptingToClose = true

        document.body.classList.remove('has-drawer')

        this.drawerContentShown = false

        setTimeout(() => {
          this.overlayShown = false
          this.drawerShown = false
          this.attemptingToClose = false
        }, 225)
      }
    }
  },

  mounted() {
    this.shown = this.open
  },

  methods: {
    dismissDrawer() {
      if (this.dismissable) {
        this.closeDrawer()
      } else {
        this.closeAttempting = true

        setTimeout(() => {
          this.closeAttempting = false
        }, 100)
      }
    },

    openDrawer() {
      if (this.attempting) return

      this.shown = true

      this.$emit('open')
    },

    closeDrawer() {
      if (this.attempting) return

      this.shown = false

      this.$emit('close')
    }
  }
}
</script>
