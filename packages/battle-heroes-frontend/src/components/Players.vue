<template>
  <ul>
    <li v-for="player in players" :key="player.id" style="margin-right: 8px">
      <img :src="player.image_url" width="32" height="32" />
      {{ player.name }}
      {{ $filters.playerState(player.state) }}
      <hr />
    </li>
  </ul>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Players',

  computed: {
    ...mapGetters({
      players: 'game/players'
    })
  }
}
</script>
