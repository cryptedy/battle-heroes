<template>
  <div v-if="$slots.trigger" class="drawer-trigger" @click="openDrawer">
    <slot name="trigger" :open="shown" />
  </div>

  <teleport to="#teleport">
    <div
      v-if="overlayShown || drawerContentShown || drawerShown"
      class="drawer"
    >
      <BaseOverlay :show="overlayShown" appear @click="closeDrawer" />

      <transition :name="transitionName">
        <div
          v-if="drawerContentShown"
          class="drawer-content"
          :class="`is-direction-${direction}`"
        >
          <span v-if="$slots.trigger">
            <BaseButton @click="closeDrawer">CLOSE</BaseButton>
          </span>

          <slot />
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

    width: {
      type: String,
      required: false,
      default: '100%'
    },

    height: {
      type: String,
      required: false,
      default: '100%'
    }
  },

  emits: ['open', 'close'],

  data() {
    return {
      shown: false,
      drawerShown: false,
      drawerContentShown: false,
      overlayShown: false,
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
