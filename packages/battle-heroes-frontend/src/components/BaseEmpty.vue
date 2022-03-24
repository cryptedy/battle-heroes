<template>
  <div class="empty">
    <div class="empty-content">
      <p class="empty-message">{{ message }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BaseEmpty',

  props: {
    message: {
      type: String,
      required: false,
      default: 'NO DATA'
    }
  }
}
</script>
