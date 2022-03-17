<template>
  <span v-if="$slots.trigger" class="drawer-trigger" @click="openDrawer">
    <slot name="trigger" :open="shown" />
  </span>

  <teleport to="#teleport">
    <div v-if="overlayShown || drawerShown" class="drawer">
      <BaseOverlay :show="overlayShown" @click="closeDrawer" />

      <transition :name="transitionName">
        <div
          v-if="drawerShown"
          class="drawer-content"
          :style="styleObject"
          :class="[`is-${direction}`]"
        >
          <slot name="default" />
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
      validator(value) {
        return ['top', 'right', 'left', 'bottom'].indexOf(value) !== -1
      }
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
      overlayShown: false
    }
  },

  computed: {
    transitionName() {
      return `drawer-content-${this.direction}`
    },

    styleObject() {
      const styleObject = {
        width: this.width,
        height: this.height
      }

      if (this.direction === 'right' || this.direction === 'left') {
        styleObject[this.direction] = '0'
      } else {
        styleObject.left = '0'
      }

      return styleObject
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
        document.body.classList.add('has-drawer')

        this.overlayShown = true

        setTimeout(() => {
          this.drawerShown = true
        }, 100)
      } else {
        document.body.classList.remove('has-drawer')

        this.drawerShown = false

        setTimeout(() => {
          this.overlayShown = false
        }, 100)
      }
    }
  },

  methods: {
    openDrawer() {
      this.shown = true

      this.$emit('open')
    },

    closeDrawer() {
      this.shown = false

      this.$emit('close')
    }
  }
}
</script>
