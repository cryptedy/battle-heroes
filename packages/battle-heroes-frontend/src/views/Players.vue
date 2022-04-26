<template>
  <div class="view-players">
    <PlayerList :players="sortedPlayers" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import PlayerList from '@/components/PlayerList'

export default {
  name: 'Players',

  components: {
    PlayerList
  },

  computed: {
    ...mapGetters({
      players: 'player/all'
    }),

    sortedPlayers() {
      let sortedPlayers = this.players

      sortedPlayers = sortedPlayers.sort((a, b) => b.exp - a.exp)

      sortedPlayers = sortedPlayers.sort(
        (a, b) => b.socket_ids.length - a.socket_ids.length
      )

      return sortedPlayers
    }
  }
}
</script>
