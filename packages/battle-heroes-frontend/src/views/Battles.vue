<template>
  <TheLayoutGame>
    <div class="view-battles">
      <BattleList :battles="battles" />
    </div>
  </TheLayoutGame>
</template>

<script>
import { mapGetters } from 'vuex'
import BattleList from '@/components/BattleList'
import TheLayoutGame from '@/components/TheLayoutGame'

export default {
  name: 'Battles',

  components: {
    BattleList,
    TheLayoutGame
  },

  computed: {
    ...mapGetters({
      battles: 'battle/all'
    })
  }
}
</script>
