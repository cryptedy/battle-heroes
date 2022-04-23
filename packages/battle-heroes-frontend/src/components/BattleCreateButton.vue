<template>
  <div v-if="canCreateBattle" style="margin-top: 16px">
    <BaseDialog
      :open="dialogShown"
      title="Select a NFT to use in battle"
      @close="onCloseDialog"
    >
      <SelectNFTs :player="player" @select="onSelectNFT" />
    </BaseDialog>

    <BaseButton type="primary" @click="createBattle">
      CREATE BATTLE
    </BaseButton>
  </div>
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

      this.emitCreateBattle(NFT)
    },

    createBattle() {
      if (Object.keys(this.nft).length > 0) {
        this.emitCreateBattle(this.nft)
      } else {
        this.dialogShown = true
      }
    },

    emitCreateBattle(NFT) {
      this.$socket.emit('battle:create', NFT.id, ({ status }) => {
        console.log('battle:create', status)

        if (status) {
          this.addNotification({
            message: 'Battle created',
            type: NOTIFICATION_TYPE.SUCCESS
          })
        } else {
          this.addNotification({
            message: 'Failed to create battle',
            type: NOTIFICATION_TYPE.ERROR
          })
        }
      })
    }
  }
}
</script>
