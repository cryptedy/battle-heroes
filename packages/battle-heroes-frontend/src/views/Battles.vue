<template>
  <div class="view-battles">
    <div class="view-actions">
      <BattleCreateButton />

      <BaseDialog
        :open="dialogShown"
        title="バトルに使用する NFT を選択"
        @close="onCloseDialog"
      >
        <SelectNFTs :player="player" @select="onSelectNFT" />
      </BaseDialog>

      <BaseButton
        :disabled="!canCreateOfflineBattle"
        type="primary"
        @click="handleCreateOfflineBattle"
      >
        1人モード - モンスターバトル
      </BaseButton>
    </div>

    <BattleList :battles="battles" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import BattleList from '@/components/BattleList'
import BattleCreateButton from '@/components/BattleCreateButton'
import SelectNFTs from '@/components/SelectNFTs'
import { PLAYER_STATE } from '@/utils/constants'

export default {
  name: 'Battles',

  components: {
    SelectNFTs,
    BattleList,
    BattleCreateButton
  },

  data() {
    return {
      dialogShown: false
    }
  },

  computed: {
    ...mapGetters({
      battles: 'battle/all',
      player: 'game/player',
      playerBattle: 'game/playerBattle'
    }),

    canCreateOfflineBattle() {
      return !this.playerBattle && this.player.state === PLAYER_STATE.IDLE
    }
  },

  methods: {
    onCloseDialog() {
      this.dialogShown = false
    },

    onSelectNFT(NFT) {
      this.dialogShown = false

      this.createOfflineBattle(NFT)
    },

    handleCreateOfflineBattle() {
      this.dialogShown = true
    },

    createOfflineBattle(NFT) {
      return this.$router.push(
        {
          name: 'battle-offline',
          params: {
            monsterId: 1,
            NFTId: NFT.id
          }
        },
        () => {}
      )
    }
  }
}
</script>
