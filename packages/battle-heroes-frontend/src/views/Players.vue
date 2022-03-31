<template>
  <TheLayoutGame>
    <div class="view-players">
      <PlayerList :players="sortedPlayers" />
    </div>
  </TheLayoutGame>
</template>

<script>
import { mapGetters } from 'vuex'
import PlayerList from '@/components/PlayerList'
import TheLayoutGame from '@/components/TheLayoutGame'

export default {
  name: 'Players',

  components: {
    PlayerList,
    TheLayoutGame
  },

  computed: {
    ...mapGetters({
      players: 'player/all'
    }),

    sortedPlayers() {
      const players = this.players

      return players.sort((a, b) => b.socket_ids.length - a.socket_ids.length)
    }
  }
}
</script>
