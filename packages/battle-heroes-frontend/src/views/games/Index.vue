<template>
  <LayoutMain>
    <p v-if="!games.length > 0">No games.</p>
    <ul v-else>
      <li v-for="game in games" :key="game.id">
        <router-link :to="{ name: 'games.show', params: { gameId: game.id } }">
          {{ findPlayer(game.player_ids[0]).name }} VS
          {{ findPlayer(game.player_ids[1]).name }}
        </router-link>
      </li>
    </ul>
  </LayoutMain>
</template>

<script>
import { mapGetters } from 'vuex'
import LayoutMain from '@/components/LayoutMain'

export default {
  name: 'Games',

  components: {
    LayoutMain
  },

  computed: {
    ...mapGetters({
      games: 'game/all',
      findPlayer: 'player/find'
    })
  }
}
</script>
