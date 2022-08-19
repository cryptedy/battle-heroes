<template>
  <div class="tab-content">
    <template v-if="type === 'default'">
      <transition :name="transitionName" mode="out-in">
        <slot />
      </transition>
    </template>

    <template v-else-if="type === 'page'">
      <BaseTransitionPage>
        <slot />
      </BaseTransitionPage>
    </template>
  </div>
</template>

<script>
export default {
  name: 'BaseTabContent',

  props: {
    type: {
      type: String,
      required: false,
      default: 'default',
      validator(value) {
        return ['default', 'page'].indexOf(value) !== -1
      }
    },

    direction: {
      type: String,
      required: false,
      default: 'left',
      validator(value) {
        return ['left', 'right'].indexOf(value) !== -1
      }
    }
  },

  computed: {
    transitionName() {
      return this.direction === 'right'
        ? 'tab-content-slide-right'
        : 'tab-content-slide-left'
    }
  }
}
</script>
