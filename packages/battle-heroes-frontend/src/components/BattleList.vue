<template>
  <BaseEmpty v-if="!battles.length > 0" />

  <BaseList v-else class="battle-list">
    <BattleListItem
      v-for="battle in battles"
      :key="battle.id"
      :battle="battle"
    />
  </BaseList>
</template>

<script>
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
  }
}
</script>
