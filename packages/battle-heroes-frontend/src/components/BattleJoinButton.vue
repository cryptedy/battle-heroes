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
    v-if="canJoinBattle"
    type="primary"
    :disabled="loading"
    @click="handle"
  >
    {{ label }}
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

  emits: ['joined'],

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
      playerBattle: 'game/playerBattle',
      hasInvitation: 'game/hasInvitation'
    }),

    isPlayerBattle() {
      return this.playerBattle && this.playerBattle.id === this.battle.id
    },

    canJoinBattle() {
      return (
        this.hasInvitation ||
        (!this.playerBattle &&
          !this.isPlayerBattle &&
          this.battle.type === BATTLE_TYPE.HUMAN &&
          this.battle.state === BATTLE_STATE.CREATED &&
          // non reserved battle
          !this.battle.players[2].id)
      )
    },

    label() {
      return this.hasInvitation ? 'バトルを受ける' : 'バトルを挑む'
    }
  },

  methods: {
    ...mapActions({
      joinBattle: 'battle/join',
      addNotification: 'notification/add'
    }),

    handle() {
      this.dialogShown = true
    },

    onCloseDialog() {
      this.dialogShown = false
    },

    onSelectNFT(NFT) {
      this.dialogShown = false

      this.execute(NFT)
    },

    async execute(NFT) {
      this.splashScreenShown = true

      this.joinBattle({ battleId: this.battle.id, NFTId: NFT.id })
        // eslint-disable-next-line no-unused-vars
        .then(({ message, player1, player2, battle }) => {
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

              this.$emit('joined', battle.id)
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
