<template>
  <div class="players">
    <PlayerList :players="sortedPlayers" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import PlayerList from '@/components/PlayerList'
import { PLAYER_STATE } from '@/utils/constants'

export default {
  name: 'PlayersView',

  components: {
    PlayerList
  },

  computed: {
    ...mapGetters({
      players: 'player/all'
    }),

    sortedPlayers() {
      let sortedPlayers = this.players

      sortedPlayers = sortedPlayers.sort((a, b) => {
        if (b.state !== PLAYER_STATE.IDLE && a.state === PLAYER_STATE.IDLE)
          return 1
        if (b.exp !== a.exp) return b.exp - a.exp
        return b.socket_ids.length - a.socket_ids.length
      })

      return sortedPlayers
    }
  }
}
</script>
