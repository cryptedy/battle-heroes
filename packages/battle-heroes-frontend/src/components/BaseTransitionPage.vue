<template>
  <transition
    :name="transitionName"
    :mode="transitionMode"
    :enter-active-class="transitionEnterActiveClass"
    @before-leave="beforeLeave"
    @enter="enter"
    @after-enter="afterEnter"
  >
    <slot />
  </transition>
</template>

<script>
export default {
  name: 'BaseTransitionPage',

  data() {
    return {
      prevHeight: 0,
      transitionName: 'transition-page-slide-left',
      transitionMode: 'out-in',
      transitionEnterActiveClass: ''
    }
  },

  created() {
    // https://router.vuejs.org/guide/advanced/transitions.html#per-route-transition
    this.$router.beforeEach((to, from, next) => {
      const toDepth = to.path.split('/').length
      const fromDepth = from.path.split('/').length

      this.transitionName =
        toDepth < fromDepth
          ? 'transition-page-slide-right'
          : 'transition-page-slide-left'
      this.transitionEnterActiveClass = `${this.transitionName}-enter-active`

      next()
    })
  },

  methods: {
    beforeLeave(element) {
      document.body.classList.add('has-transition-page')

      this.prevHeight = window.getComputedStyle(element).height
    },

    enter(element) {
      const { height } = window.getComputedStyle(element)

      element.style.height = this.prevHeight

      setTimeout(() => {
        element.style.height = height
      })
    },

    afterEnter(element) {
      document.body.classList.remove('has-transition-page')

      element.style.height = 'auto'
    }
  }
}
</script>
