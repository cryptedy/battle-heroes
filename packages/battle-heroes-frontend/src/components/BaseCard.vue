<template>
  <div class="card">
    <div class="card-header">
      <h1 class="card-header-title">
        {{ title }}
      </h1>
    </div>

    <div v-if="$slots.default" class="card-body">
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  name: 'BaseCard',

  props: {
    title: {
      type: String,
      required: true
    }
  }
}
</script>
