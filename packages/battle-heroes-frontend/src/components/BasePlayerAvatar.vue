<template>
  <img
    v-if="!player.avatar_url"
    src="@/assets/images/blank-avatar.png"
    :width="width"
    :height="height"
  />
  <img v-else :src="player.avatar_url" :width="width" :height="height" />
</template>

<script>
export default {
  name: 'BasePlayerAvatar',

  props: {
    player: {
      type: Object,
      required: true
    },

    width: {
      type: Number,
      default: 32
    },

    height: {
      type: Number,
      default: 32
    }
  }
}
</script>
