<template>
  <BaseButton
    v-if="canRestartBattle"
    type="primary"
    :disabled="loading"
    @click="restartBattle"
  >
    バトルを再開
  </BaseButton>
</template>

<script>
import { mapGetters } from 'vuex'
import { BATTLE_SPLASH_SCREEN_TYPE } from '@/utils/constants'

export default {
  name: 'BattleRestartButton',

  props: {
    battle: {
      type: Object,
      required: true
    }
  },

  data() {
    return {
      loading: false
    }
  },

  computed: {
    ...mapGetters({
      player: 'game/player',
      playerBattle: 'game/playerBattle'
    }),

    isPlayerBattle() {
      return this.playerBattle && this.playerBattle.id === this.battle.id
    },

    canRestartBattle() {
      return this.playerBattle && this.isPlayerBattle
    }
  },

  methods: {
    async restartBattle() {
      this.loading = true

      this.$router
        .push(
          {
            name: 'battles.show',
            params: {
              battleId: this.battle.id,
              splashScreenType: BATTLE_SPLASH_SCREEN_TYPE.MATCHING
            }
          },
          () => {}
        )
        .then(() => {
          this.loading = false
        })
    }
  }
}
</script>
