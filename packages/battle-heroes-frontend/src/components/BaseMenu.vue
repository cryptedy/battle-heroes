<template>
  <div ref="trigger" class="menu-trigger" @click="toggleMenu">
    <slot name="trigger" :open="shown" />
  </div>

  <teleport to="#teleport">
    <div v-if="overlayShown || menuContentShown || menuShown" class="menu">
      <BaseOverlay :show="overlayShown" appear @click="closeMenu" />

      <transition name="menu-content">
        <div v-if="menuContentShown" class="menu-content" :style="styleObject">
          <slot />
        </div>
      </transition>
    </div>
  </teleport>
</template>

<script>
import { mapGetters } from 'vuex'

const isParentPositionFixed = element => {
  let el

  if (typeof element === 'object') {
    el = element[0] || element
  } else if (typeof element === 'string') {
    el = document.querySelector(element)
  }

  while (typeof el === 'object' && el.nodeName.toLowerCase() !== 'body') {
    if (
      window.getComputedStyle(el).getPropertyValue('position').toLowerCase() ===
      'fixed'
    ) {
      return true
    }

    el = el.parentElement
  }

  return false
}

export default {
  name: 'BaseMenu',

  props: {
    open: {
      type: Boolean,
      required: false,
      default: false
    },

    align: {
      type: String,
      required: false,
      default: 'left',
      validator: value => ['right', 'left'].indexOf(value) !== -1
    }
  },

  emits: ['open', 'close'],

  data() {
    return {
      processing: false,
      shown: false,
      menuShown: false,
      menuContentShown: false,
      overlayShown: false,
      triggerDimensions: null,
      isParentPositionFixed: false
    }
  },

  computed: {
    ...mapGetters({
      scrollbarWidth: 'scrollbar/width',
      windowDimensions: 'window/dimensions'
    }),

    styleObject() {
      let top = 'auto'
      let right = 'auto'
      let left = 'auto'

      top = this.triggerDimensions.top
      top += this.triggerDimensions.height
      top += 4

      if (this.align === 'left') {
        left = this.triggerDimensions.left
      } else if (this.align === 'right') {
        right =
          this.windowDimensions.width -
          (this.triggerDimensions.left + this.triggerDimensions.width) -
          this.scrollbarWidth
      }

      // TODO
      if (!this.isParentPositionFixed) {
        top += this.windowDimensions.offsetY

        if (this.align === 'left') {
          left += this.windowDimensions.offsetX
        } else if (this.align === 'right') {
          //
        }
      }

      top = top !== 'auto' ? `${Math.round(top)}px` : top
      right = right !== 'auto' ? `${Math.round(right)}px` : right
      left = left !== 'auto' ? `${Math.round(left)}px` : left

      return {
        position: 'absolute',
        top: top,
        right: right,
        left: left
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
      this.processing = true

      if (value) {
        document.body.classList.add('has-menu')

        this.menuShown = true
        this.overlayShown = true

        setTimeout(() => {
          this.menuContentShown = true
          this.processing = false
        }, 200 / 2)
      } else {
        document.body.classList.remove('has-menu')

        this.menuContentShown = false

        setTimeout(() => {
          this.overlayShown = false
          this.menuShown = false
          this.processing = false
        }, 225)
      }
    },

    windowDimensions: {
      // eslint-disable-next-line no-unused-vars
      handler(value, oldValue) {
        this.triggerDimensions = this.$refs.trigger.getBoundingClientRect()
      },
      deep: true
    }
  },

  mounted() {
    this.shown = this.open

    setImmediate(() => {
      this.triggerDimensions = this.$refs.trigger.getBoundingClientRect()
      this.isParentPositionFixed = isParentPositionFixed(this.$refs.trigger)
    })
  },

  methods: {
    toggleMenu() {
      this.shown ? this.closeMenu() : this.openMenu()
    },

    openMenu() {
      if (this.processing) return
      this.shown = true

      this.$emit('open')
    },

    closeMenu() {
      if (this.processing) return

      this.shown = false

      this.$emit('close')
    }
  }
}
</script>

<style lang="scss">
.menu {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  outline: none;
  color: color(primary);
  z-index: z-index(menu);

  &-content {
    background-color: palette(grey, 0);
    border: 1px solid palette(grey, 400);
    border-radius: 2px;
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.2);
    white-space: normal;

    &-trigger {
      display: inline-block;
      user-select: none;
    }

    &-enter-active {
      transition: all 200ms;
    }
    &-leave-active {
      transition: all 100ms;
    }
    &-enter-from,
    &-leave-to {
      opacity: 0;
    }
    &-enter-from {
      transform: translateY(-6px);
    }
  }
}
</style>
