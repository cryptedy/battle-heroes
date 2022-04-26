<template>
  <div v-if="canJoinBattle" class="battle-join-button">
    <BaseDialog
      :open="dialogShown"
      title="Select a NFT to use in battle"
      @close="onCloseDialog"
    >
      <SelectNFTs :player="player" @select="onSelectNFT" />
    </BaseDialog>

    <BaseButton type="primary" @click="joinBattle"> JOIN </BaseButton>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { BATTLE_STATE } from '@/utils/constants'
import SelectNFTs from '@/components/SelectNFTs'

export default {
  name: 'BattleJoinButton',

  components: {
    SelectNFTs
  },

  props: {
    battle: {
      type: Object,
      required: true
    }
  },

  data() {
    return {
      dialogShown: false,
      selectedBattle: null
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

    canJoinBattle() {
      return (
        !this.playerBattle &&
        !this.isPlayerBattle &&
        this.battle.state === BATTLE_STATE.CREATED
      )
    }
  },

  methods: {
    ...mapActions({
      addNotification: 'notification/add'
    }),

    onCloseDialog() {
      this.dialogShown = false
      this.selectedBattle = null
    },

    onSelectNFT(NFT) {
      this.$socket.emit('battle:join', this.selectedBattle.id, NFT.id)

      this.selectedBattle = null
      this.dialogShown = false
    },

    joinBattle() {
      this.selectedBattle = this.battle
      this.dialogShown = true
    }
  }
}
</script>