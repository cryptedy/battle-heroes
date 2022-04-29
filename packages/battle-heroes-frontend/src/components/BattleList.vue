<template>
  <BaseEmpty v-if="!availableBattles.length > 0" text="NO BATTLES" />

  <BaseList v-else class="battle-list">
    <BattleListItem
      v-for="battle in availableBattles"
      :key="battle.id"
      :battle="battle"
    />
  </BaseList>
</template>

<script>
import { BATTLE_STATE } from '@/utils/constants'
import BattleListItem from '@/components/BattleListItem'

export default {
  name: 'BattleList',

  components: {
    BattleListItem
  },

  props: {
    battles: {
      type: Array,
      required: true
    }
  },

  computed: {
    availableBattles() {
      return this.battles.filter(battle => battle.state !== BATTLE_STATE.ENDED)
    }
  }
}
</script>
