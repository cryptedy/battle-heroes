<template>
  <div
    class="player-state"
    :class="`is-${$filters.playerState(player.state).toLowerCase()}`"
  >
    {{ $filters.playerState(player.state).toUpperCase() }}
  </div>
</template>

<script>
export default {
  name: 'PlayerState',

  props: {
    player: {
      type: Object,
      required: true
    }
  }
}
</script>
