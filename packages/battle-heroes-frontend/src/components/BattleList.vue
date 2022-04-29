<template>
  <BaseEmpty v-if="!battles.length > 0" text="NO BATTLES" />

  <BaseList v-else class="battle-list">
    <BattleListItem
      v-for="battle in battles"
      :key="battle.id"
      :battle="battle"
      :games="games"
      @game-load="onGameLoad"
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
  },

  data() {
    return {
      games: []
    }
  },

  watch: {
    battles: {
      // eslint-disable-next-line no-unused-vars
      async handler(value, oldValue) {
        if (oldValue) {
          const deletedBattles = oldValue.filter(
            battle => !value.includes(battle)
          )

          deletedBattles.forEach(battle => this.removeGame(battle))
        }
      },
      immediate: true
    }
  },

  mounted() {
    this.$socket.on('game:update', this.onGameUpdate)
  },

  beforeUnmount() {
    this.$socket.off('game:update')
  },

  methods: {
    onGameLoad(game) {
      console.log('onGameLoad', game)

      this.addOrUpdateGame(game)
    },

    onGameUpdate(game) {
      console.log('onGameUpdate', game)

      this.addOrUpdateGame(game)
    },

    addOrUpdateGame(newGame) {
      const index = this.games.findIndex(game => game.id === newGame.id)

      if (index === -1) {
        this.games.push(newGame)
      } else {
        this.games.splice(index, 1, newGame)
      }
    },

    removeGame(battle) {
      const index = this.games.findIndex(game => game.battle_id === battle.id)

      if (index !== -1) this.games.splice(index, 1)
    }
  }
}
</script>
