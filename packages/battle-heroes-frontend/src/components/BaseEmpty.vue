<template>
  <div class="empty">
    <div class="empty-content">
      <p class="empty-text">
        {{ text }}
      </p>

      <FontAwesomeIcon icon="ghost" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'BaseEmpty',

  props: {
    text: {
      type: String,
      required: false,
      default: 'NO DATA'
    }
  }
}
</script>
