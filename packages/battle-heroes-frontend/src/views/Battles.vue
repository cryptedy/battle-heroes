<template>
  <TheLayoutGame>
    <div class="view-battles">
      <BattleCreateButton />

      <BattleList :battles="battles" />
    </div>
  </TheLayoutGame>
</template>

<script>
import { mapGetters } from 'vuex'
import BattleList from '@/components/BattleList'
import TheLayoutGame from '@/components/TheLayoutGame'
import BattleCreateButton from '@/components/BattleCreateButton'

export default {
  name: 'Battles',

  components: {
    BattleList,
    TheLayoutGame,
    BattleCreateButton
  },

  computed: {
    ...mapGetters({
      battles: 'battle/all'
    })
  }
}
</script>
