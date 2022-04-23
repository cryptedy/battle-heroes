<template>
  <div class="battle-nav">
    <div v-if="playerBattle" style="max-width: 64px">
      <img
        style="width: 100%; height: auto"
        :src="playerNFT.image_url"
        :alt="playerNFT.name"
        width="512"
        height="512"
      />
    </div>

    <BaseDialog :open="dialogShown" title="Select NFTs" @close="onCloseDialog">
      <SelectNFTs :player="player" @select="onSelectNFT" />
    </BaseDialog>

    <BaseButton
      v-if="!playerBattle && player.state === PLAYER_STATE.IDLE"
      type="primary"
      @click="randomBattle"
    >
      RANDOM BATTLE
    </BaseButton>

    <BaseButton
      v-if="!playerBattle && player.state === PLAYER_STATE.IDLE"
      type="primary"
      @click="createBattle"
    >
      CREATE BATTLE
    </BaseButton>

    <BaseButton
      v-if="
        playerBattle &&
        (playerBattle.state === BATTLE_STATE.ENDED ||
          player.state !== PLAYER_STATE.BATTLE)
      "
      type="danger"
      @click="deleteBattle"
    >
      DELETE BATTLE
    </BaseButton>
    <BaseButton
      v-else-if="player.state === PLAYER_STATE.STANDBY"
      type="primary"
    >
      IDLE
    </BaseButton>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import SelectNFTs from '@/components/SelectNFTs'
import {
  PLAYER_STATE,
  BATTLE_STATE,
  NOTIFICATION_TYPE
} from '@/utils/constants'

export default {
  name: 'BattleNav',

  components: {
    SelectNFTs
  },

  props: {
    player: {
      type: Object,
      required: true
    }
  },

  data() {
    return {
      dialogShown: false
    }
  },

  computed: {
    ...mapGetters({
      playerNFT: 'battle/playerNFT',
      playerBattle: 'game/playerBattle'
    }),

    PLAYER_STATE() {
      return PLAYER_STATE
    },

    BATTLE_STATE() {
      return BATTLE_STATE
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

      this.$socket.emit('battle:create', NFT.id, ({ status }) => {
        console.log('battle:create', status)

        if (status) {
          this.addNotification({
            message: 'Battle created',
            type: NOTIFICATION_TYPE.SUCCESS
          })
        } else {
          this.addNotification({
            message: 'Failed to create game',
            type: NOTIFICATION_TYPE.ERROR
          })
        }
      })
    },

    randomBattle() {
      this.$socket.emit('battle:random', {})
    },

    createBattle() {
      this.dialogShown = true
    },

    deleteBattle() {
      this.$socket.emit('battle:delete', this.playerBattle.id, status => {
        if (status) {
          this.addNotification({
            message: 'Battle deleted!',
            type: NOTIFICATION_TYPE.SUCCESS
          })
        }
      })
    }
  }
}
</script>
