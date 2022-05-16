<template>
  <div class="view-battles">
    <div class="view-actions">
      <BattleCreateButton />

      <BaseDialog
        :open="dialogShown"
        title="Select a NFT to use in battle"
        @close="onCloseDialog"
      >
        <SelectNFTs :player="player" @select="onSelectNFT" />
      </BaseDialog>

      <BaseButton type="primary" @click="handleCreatePracticeBattle">
        MOSTER BATTLE
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
      player: 'game/player'
    })
  },

  methods: {
    onCloseDialog() {
      this.dialogShown = false
    },

    onSelectNFT(NFT) {
      this.dialogShown = false

      this.createPracticeBattle(NFT)
    },

    handleCreatePracticeBattle() {
      this.dialogShown = true
    },

    createPracticeBattle(NFT) {
      return this.$router.push(
        {
          name: 'battle-practice',
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
