<template>
  <BattleList :battles="battles" />
</template>

<script>
import { mapGetters } from 'vuex'
import BattleList from '@/components/BattleList'

export default {
  name: 'BattlesView',

  components: {
    BattleList
  },

  computed: {
    ...mapGetters({
      battles: 'battle/all',
      player: 'game/player',
      findPlayer: 'player/find',
      playerBattle: 'game/playerBattle'
    })
  }
}
</script>
