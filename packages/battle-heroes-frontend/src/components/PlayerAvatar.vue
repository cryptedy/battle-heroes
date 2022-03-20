<template>
  <div class="player-avatar">
    <img
      v-if="!player.avatar_url"
      src="@/assets/images/blank-avatar.png"
      :width="width"
      :height="height"
    />
    <img v-else :src="player.avatar_url" :width="width" :height="height" />
  </div>
</template>

<script>
export default {
  name: 'PlayerAvatar',

  props: {
    player: {
      type: Object,
      required: true
    },

    width: {
      type: Number,
      default: 42
    },

    height: {
      type: Number,
      default: 42
    }
  }
}
</script>

<style lang="scss">
.player-avatar {
  display: inline-block;
  width: 42px;
  height: 42px;

  > img {
    object-fit: cover;
    border-radius: 50%;
  }
}
</style>
