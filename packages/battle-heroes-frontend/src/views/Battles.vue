<template>
  <div class="view-battles">
    <BattleCreateButton style="margin-top: 16px" />

    <BattleList :battles="battles" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import BattleList from '@/components/BattleList'
import BattleCreateButton from '@/components/BattleCreateButton'

export default {
  name: 'Battles',

  components: {
    BattleList,
    BattleCreateButton
  },

  computed: {
    ...mapGetters({
      battles: 'battle/all'
    })
  }
}
</script>
