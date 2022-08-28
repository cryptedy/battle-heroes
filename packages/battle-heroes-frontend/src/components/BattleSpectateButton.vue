<template>
  <BaseButton
    v-if="canSpectateBattle"
    type="primary"
    :disabled="loading"
    @click="spectateBattle"
  >
    観戦
  </BaseButton>
</template>

<script>
import { mapGetters } from 'vuex'
import { PLAYER_STATE, BATTLE_SPLASH_SCREEN_TYPE } from '@/utils/constants'

export default {
  name: 'BattleSpectateButton',

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
      battles: 'battle/all',
      player: 'game/player',
      playerNFT: 'battle/playerNFT',
      playerBattle: 'game/playerBattle'
    }),

    canSpectateBattle() {
      return !this.playerBattle && this.player.state === PLAYER_STATE.IDLE
    }
  },

  methods: {
    spectateBattle() {
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
