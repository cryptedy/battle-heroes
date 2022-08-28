<template>
  <SplashScreen v-if="splashScreenShown" message="Loading..." />

  <BaseDialog
    :open="dialogShown"
    title="バトルに使用する NFT を選択"
    @close="onCloseDialog"
  >
    <SelectNFTs :player="player" @select="onSelectNFT" />
  </BaseDialog>

  <BaseButton
    v-if="canRushBattle"
    type="primary"
    :disabled="loading"
    @click="handle"
  >
    バトルに乱入
  </BaseButton>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import SelectNFTs from '@/components/SelectNFTs'
import SplashScreen from '@/components/SplashScreen'
import {
  BATTLE_STATE,
  BATTLE_TYPE,
  NOTIFICATION_TYPE,
  BATTLE_SPLASH_SCREEN_TYPE
} from '@/utils/constants'

export default {
  name: 'BattleJoinButton',

  components: {
    SelectNFTs,
    SplashScreen
  },

  props: {
    battle: {
      type: Object,
      required: true
    }
  },

  data() {
    return {
      loading: false,
      splashScreenShown: false,
      dialogShown: false
    }
  },

  computed: {
    ...mapGetters({
      findNFT: 'NFT/find',
      player: 'game/player',
      findPlayer: 'player/find',
      playerBattle: 'game/playerBattle'
    }),

    isPlayerBattle() {
      return this.playerBattle && this.playerBattle.id === this.battle.id
    },

    canRushBattle() {
      return (
        !this.playerBattle &&
        !this.isPlayerBattle &&
        this.battle.type === BATTLE_TYPE.CPU &&
        this.battle.state === BATTLE_STATE.STARTED
      )
    }
  },

  methods: {
    ...mapActions({
      rushBattle: 'battle/rush',
      addNotification: 'notification/add'
    }),

    handle() {
      this.dialogShown = true
    },

    onCloseDialog() {
      this.dialogShown = false
      this.selectedBattle = null
    },

    onSelectNFT(NFT) {
      this.dialogShown = false

      this.execute(NFT)
    },

    execute(NFT) {
      this.loading = true
      this.splashScreenShown = true

      this.rushBattle({ battleId: this.battle.id, NFTId: NFT.id })
        // eslint-disable-next-line no-unused-vars
        .then(({ message, battle, player1, player2 }) => {
          this.$router
            .push(
              {
                name: 'battles.show',
                params: {
                  battleId: battle.id,
                  splashScreenType: BATTLE_SPLASH_SCREEN_TYPE.MATCHING
                }
              },
              () => {}
            )
            .then(() => {
              this.loading = false
              this.splashScreenShown = false
            })
        })
        .catch(error => {
          this.addNotification({
            message: error.message,
            type: NOTIFICATION_TYPE.ERROR,
            timeout: 0
          })

          this.loading = false
          this.splashScreenShown = false
        })
    }
  }
}
</script>
