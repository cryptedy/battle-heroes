<template>
  <ul>
    <li v-for="player in players" :key="player.id" style="margin-right: 8px">
      <BasePlayerAvatar :player="player" />

      {{ player.name }}
      -
      <span
        v-if="player.socket_ids.length > 0"
        style="font-weight: bold; color: green"
      >
        ONLINE
      </span>
      <span v-else style="font-weight: bold; color: grey"> OFFLINE </span>
      - Lv.
      {{ player.level }}
      -
      {{ player.token_ids[1].length + player.token_ids[2].length }} heros -
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
      players: 'player/all'
    })
  }
}
</script>
