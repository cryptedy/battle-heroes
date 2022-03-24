<template>
  <TheLayoutGame>
    <PlayerList :players="players" />
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
    })
  }
}
</script>
