<template>
  <template v-if="canCreateBattle">
    <BaseDialog
      :open="dialogShown"
      title="バトルに使用する NFT を選択"
      @close="onCloseDialog"
    >
      <SelectNFTs :player="player" @select="onSelectNFT" />
    </BaseDialog>

    <BaseButton type="primary" @click="handleCreateBattle">
      バトル作成
    </BaseButton>
  </template>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import SelectNFTs from '@/components/SelectNFTs'
import { PLAYER_STATE, NOTIFICATION_TYPE } from '@/utils/constants'

export default {
  name: 'BattleCreateButton',

  components: {
    SelectNFTs
  },

  props: {
    nft: {
      type: Object,
      required: false,
      default: () => ({})
    }
  },

  data() {
    return {
      dialogShown: false
    }
  },

  computed: {
    ...mapGetters({
      player: 'game/player',
      playerNFT: 'battle/playerNFT',
      playerBattle: 'game/playerBattle'
    }),

    canCreateBattle() {
      return !this.playerBattle && this.player.state === PLAYER_STATE.IDLE
    }
  },

  methods: {
    ...mapActions({
      addNotification: 'notification/add'
    }),

    onCloseDialog() {
      this.dialogShown = false
    },

    onSelectNFT(NFT) {
      this.dialogShown = false

      this.createBattle(NFT)
    },

    handleCreateBattle() {
      if (Object.keys(this.nft).length > 0) {
        this.createBattle(this.nft)
      } else {
        this.dialogShown = true
      }
    },

    createBattle(NFT) {
      this.$socket.emit('battle:create', NFT.id, ({ status, message }) => {
        console.log('battle:create', status)

        if (status) {
          this.addNotification({
            message,
            type: NOTIFICATION_TYPE.SUCCESS
          })

          setTimeout(() => {
            // start a CPU battle if not matched any opponents within 15 seconds.
            if (
              this.player.state === PLAYER_STATE.STANDBY &&
              this.playerBattle
            ) {
              this.$dialog.open({
                title: '対戦相手が見つかりません',
                message: `
                  <p>現在対戦相手が見つかりません。</p>
                  <p>1人用モードの CPU バトルを開始しますか？</p>
                `,
                confirmLabel: 'CPU バトルを開始',
                cancelLabel: '対戦相手を待つ',
                onConfirm: () => {
                  return this.$router.push(
                    {
                      name: 'battle-offline',
                      params: {
                        NFTId: NFT.id
                      }
                    },
                    () => {}
                  )

                  // abort battle and start CPU battle
                  // return this.$socket.emit(
                  //   'battle:delete',
                  //   this.playerBattle.id,
                  //   // eslint-disable-next-line no-unused-vars
                  //   ({ status, message }) => {
                  //     if (status) {
                  //       return this.$router.push(
                  //         {
                  //           name: 'battle-offline',
                  //           params: {
                  //             NFTId: NFT.id
                  //           }
                  //         },
                  //         () => {}
                  //       )
                  //     } else {
                  //       //
                  //     }
                  //   }
                  // )
                }
              })
            }
          }, 15000)
        } else {
          this.addNotification({
            message,
            type: NOTIFICATION_TYPE.ERROR,
            timeout: 0
          })
        }
      })
    }
  }
}
</script>
