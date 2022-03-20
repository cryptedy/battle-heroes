<template>
  <LayoutMain>
    <div v-if="!game">Game not found</div>

    <div v-else>
      {{ game }}

      <hr />

      <p>You: {{ player }}</p>

      <hr />

      <p>Opponent: {{ opponentPlayer }}</p>
    </div>
  </LayoutMain>
</template>

<script>
import { mapGetters } from 'vuex'
import LayoutMain from '@/components/LayoutMain'

export default {
  name: 'GamesShow',

  components: {
    LayoutMain
  },

  computed: {
    ...mapGetters({
      game: 'auth/game',
      player: 'auth/player',
      findPlayer: 'player/find'
    }),

    opponentPlayer() {
      const opponentPlayerId = this.game.player_ids.find(
        playerId => playerId !== this.player.id
      )

      return this.findPlayer(opponentPlayerId)
    }
  },

  created() {
    this.$socket.emit('game:join')
  }
}
</script>
