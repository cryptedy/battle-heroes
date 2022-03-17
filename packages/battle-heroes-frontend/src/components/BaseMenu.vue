<template>
  <span ref="trigger" class="menu-trigger" @click="toggleMenu">
    <slot name="trigger" :open="shown" />
  </span>

  <teleport to="#teleport">
    <transition name="menu">
      <div v-if="shown" ref="menu" class="menu" :style="styleObject">
        <slot name="default" />
      </div>
    </transition>
  </teleport>
</template>

<script>
export default {
  name: 'BaseMenu',

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
      shown: this.open,
      triggerDimensions: null
    }
  },

  computed: {
    styleObject() {
      return {
        position: 'absolute',
        top: `${Math.round(this.triggerDimensions.bottom)}px`,
        right: '16px',
        widht: '450px'
      }
    }
  },

  watch: {
    // eslint-disable-next-line no-unused-vars
    open(value, oldValue) {
      this.shown = value
    },

    // eslint-disable-next-line no-unused-vars
    loading(value, oldValue) {
      if (oldValue && !value) {
        this.updateDimensions()
      }
    }
  },

  created() {
    document.addEventListener('click', this.onClickDocument)

    if (this.closeOnRouteChange) {
      this.$router.beforeEach((to, from, next) => {
        if (from.name !== to.name) {
          this.closeMenu()
        }

        next()
      })
    }
  },

  mounted() {
    this.triggerDimensions = this.$refs.trigger.getBoundingClientRect()
  },

  beforeUnmount() {
    document.removeEventListener('click', this.onClickDocument)
  },

  methods: {
    toggleMenu() {
      this.shown ? this.closeMenu() : this.openMenu()
    },

    openMenu() {
      this.shown = true

      this.$emit('open')
    },

    closeMenu() {
      this.shown = false

      this.$emit('close')
    },

    onClickDocument(event) {
      const trigger = this.$refs.trigger
      const menu = this.$refs.menu

      if (!menu) return

      const target = event.target

      if (
        menu !== target &&
        !menu.contains(target) &&
        trigger !== target &&
        !trigger.contains(target)
      ) {
        this.closeMenu()
      }
    }
  }
}
</script>
