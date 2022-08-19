<template>
  <transition
    :name="transitionName"
    :mode="transitionMode"
    :enter-active-class="transitionEnterActiveClass"
    @before-leave="onBeforeLeave"
    @enter="onEnter"
    @after-enter="onAfterEnter"
  >
    <slot />
  </transition>
</template>

<script>
export default {
  name: 'BaseTransitionPage',

  props: {
    type: {
      type: String,
      required: false,
      default: 'route',
      validator(value) {
        return ['route', 'page'].indexOf(value) !== -1
      }
    }
  },

  data() {
    return {
      prevHeight: 0,
      transitionName: 'transition-page-slide-left',
      transitionMode: 'out-in',
      transitionEnterActiveClass: ''
    }
  },

  created() {
    this.$router.beforeEach((to, from, next) => {
      if (this.type === 'route') {
        const toDepth = to.path.split('/').length
        const fromDepth = from.path.split('/').length

        this.transitionName =
          toDepth < fromDepth
            ? 'transition-page-slide-right'
            : 'transition-page-slide-left'
      } else if (this.type === 'page') {
        const toPage = Number.parseInt(to.query.page) || 1
        const fromPage = Number.parseInt(from.query.page) || 1

        this.transitionName =
          fromPage < toPage
            ? 'transition-page-slide-right'
            : 'transition-page-slide-left'
      }

      this.transitionEnterActiveClass = `${this.transitionName}-enter-active`

      next()
    })
  },

  methods: {
    onBeforeLeave(element) {
      document.body.classList.add('has-transition-page')

      this.prevHeight = window.getComputedStyle(element).height
    },

    onEnter(element) {
      const { height } = window.getComputedStyle(element)

      element.style.height = this.prevHeight

      setTimeout(() => {
        element.style.height = height
      })
    },

    onAfterEnter(element) {
      document.body.classList.remove('has-transition-page')

      element.style.height = 'auto'
    }
  }
}
</script>
