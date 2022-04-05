<template>
  <div class="battle-nav">
    <div v-if="playerBattle" style="max-width: 64px">
      <img
        style="width: 100%; height: auto"
        :src="findNFT(playerBattle.player.NFT_id).image_url"
        :alt="findNFT(playerBattle.player.NFT_id).name"
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
      v-if="playerBattle && player.state !== PLAYER_STATE.BATTLE"
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
import { PLAYER_STATE, NOTIFICATION_TYPE } from '@/utils/constants'
import SelectNFTs from '@/components/SelectNFTs'

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
      findNFT: 'NFT/find',
      playerBattle: 'game/battle'
    }),

    PLAYER_STATE() {
      return PLAYER_STATE
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

      this.$socket.emit('battle:create', NFT.id)

      this.addNotification({
        message: 'Battle created!',
        type: NOTIFICATION_TYPE.SUCCESS
      })
    },

    randomBattle() {
      this.$socket.emit('battle:random', {})
    },

    createBattle() {
      this.dialogShown = true
    },

    deleteBattle() {
      this.$socket.emit('battle:delete', this.playerBattle.id)

      this.addNotification({
        message: 'Battle deleted!',
        type: NOTIFICATION_TYPE.SUCCESS
      })
    }
  }
}
</script>
