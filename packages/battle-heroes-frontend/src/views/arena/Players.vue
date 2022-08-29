<template>
  <div class="players">
    <PlayerList :players="sortedPlayers" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import PlayerList from '@/components/PlayerList'

export default {
  name: 'PlayersView',

  components: {
    PlayerList
  },

  computed: {
    ...mapGetters({
      players: 'player/allHuman'
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
