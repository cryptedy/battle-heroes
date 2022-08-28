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
    v-if="canStartBattle"
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
  BATTLE_TYPE,
  BATTLE_STATE,
  PLAYER_STATE,
  NOTIFICATION_TYPE,
  BATTLE_SPLASH_SCREEN_TYPE
} from '@/utils/constants'

export default {
  name: 'BattleCreateButton',

  components: {
    SelectNFTs,
    SplashScreen
  },

  props: {
    nft: {
      type: Object,
      required: false,
      default: () => ({})
    },

    label: {
      type: String,
      required: false,
      default: 'バトルを開始'
    },

    timeout: {
      type: Number,
      required: false,
      default: 5000
    }
  },

  emits: ['created'],

  data() {
    return {
      loading: false,
      splashScreenShown: false,
      dialogShown: false
    }
  },

  computed: {
    ...mapGetters({
      battles: 'battle/all',
      player: 'game/player',
      playerNFT: 'battle/playerNFT',
      playerBattle: 'game/playerBattle'
    }),

    canStartBattle() {
      return !this.playerBattle && this.player.state === PLAYER_STATE.IDLE
    },

    availableBattles() {
      return this.battles.filter(
        battle =>
          battle.type === BATTLE_TYPE.HUMAN &&
          battle.state === BATTLE_STATE.CREATED
      )
    }
  },

  methods: {
    ...mapActions({
      joinBattle: 'battle/join',
      createBattle: 'battle/create',
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
      this.loading = true
      this.splashScreenShown = true

      if (this.availableBattles.length > 0) {
        // join other battle

        // use oldest one
        const battle = this.availableBattles[0]

        this.joinBattle({ battleId: battle.id, NFTId: NFT.id })
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
      } else {
        // create a new battle
        this.createBattle({ NFTId: NFT.id, timeout: this.timeout })
          // eslint-disable-next-line no-unused-vars
          .then(({ message, battle, player }) => {
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

                this.$emit('created', battle.id)
              })
          })
          .catch(error => {
            this.addNotification({
              message: error,
              type: NOTIFICATION_TYPE.ERROR,
              timeout: 0
            })

            this.loading = false
            this.splashScreenShown = false
          })
      }
    }
  }
}
</script>
