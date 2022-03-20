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
            <button @click="closeDrawer">CLOSE</button>
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
      processing: false,
      shown: false,
      drawerShown: false,
      drawerContentShown: false,
      overlayShown: false
    }
  },

  computed: {
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
      this.processing = true

      if (value) {
        document.body.classList.add('has-drawer')

        this.drawerShown = true
        this.overlayShown = true

        setTimeout(() => {
          this.drawerContentShown = true
          this.processing = false
        }, 225 / 2)
      } else {
        document.body.classList.remove('has-drawer')

        this.drawerContentShown = false

        setTimeout(() => {
          this.overlayShown = false
          this.drawerShown = false
          this.processing = false
        }, 225)
      }
    }
  },

  mounted() {
    this.shown = this.open
  },

  methods: {
    openDrawer() {
      if (this.processing) return

      this.shown = true

      this.$emit('open')
    },

    closeDrawer() {
      if (this.processing) return

      this.shown = false

      this.$emit('close')
    }
  }
}
</script>

<style lang="scss">
.drawer {
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  outline: none;
  color: color(primary);
  z-index: z-index(drawer);

  &-trigger {
    display: inline-block;
    user-select: none;
  }

  &-content {
    overflow-y: auto;
    position: fixed;
    background-color: palette(grey, 0);
    &.is-direction {
      &-left,
      &-right {
        width: 80%;
        @include mediaQuery(sm) {
          width: 250px;
        }
        height: 100%;
        max-width: 80%;
      }
      &-left {
        left: 0;
      }
      &-right {
        right: 0;
      }
      &-top,
      &-bottom {
        width: 100%;
        height: 40%;
        @include mediaQuery(sm) {
          height: 220px;
        }
        max-height: 100%;
      }
      &-top {
        top: 0;
      }
      &-bottom {
        bottom: 0;
      }
    }

    &-top-enter-active,
    &-top-leave-active {
      transform: translate(0px, 0px);
      transition: transform 225ms cubic-bezier(0, 0, 0.2, 1) 0ms;
    }
    &-top-enter-from {
      transform: translateY(-100vh) translateY(0px);
    }
    &-top-leave-to {
      transform: translateY(-100%) translateY(0px);
    }

    &-bottom-enter-active,
    &-bottom-leave-active {
      transform: translate(0px, 0px);
      transition: transform 225ms cubic-bezier(0, 0, 0.2, 1) 0ms;
    }
    &-bottom-enter-from {
      transform: translateY(100vh) translateY(0px);
    }
    &-bottom-leave-to {
      transform: translateY(100%) translateY(0px);
    }

    &-left-enter-active,
    &-left-leave-active {
      transform: translate(0px, 0px);
      transition: transform 225ms cubic-bezier(0, 0, 0.2, 1) 0ms;
    }
    &-left-enter-from {
      transform: translateX(-100vw) translateX(0px);
    }
    &-left-leave-to {
      transform: translateX(-100%) translateX(0px);
    }

    &-right-enter-active,
    &-right-leave-active {
      transform: translate(0px, 0px);
      transition: transform 225ms cubic-bezier(0, 0, 0.2, 1) 0ms;
    }
    &-right-enter-from {
      transform: translateX(100vw) translateX(0px);
    }
    &-right-leave-to {
      transform: translateX(100%) translateX(0px);
    }
  }
}
</style>
