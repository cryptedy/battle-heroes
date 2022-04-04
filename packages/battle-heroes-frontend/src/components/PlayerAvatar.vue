<template>
  <div class="player-avatar">
    <img
      v-if="!player.avatar_url"
      src="@/assets/images/blank-avatar.png"
      width="100"
      height="100"
    />
    <img v-else :src="player.avatar_url" width="100" height="100" />
  </div>
</template>

<script>
export default {
  name: 'PlayerAvatar',

  props: {
    player: {
      type: Object,
      required: true
    }
  }
}
</script>
