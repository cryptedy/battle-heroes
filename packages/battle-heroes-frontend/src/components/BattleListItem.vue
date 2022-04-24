<template>
  <BaseListItem class="battle-list-item">
    <div class="battle-list-item-primary">
      <div style="width: 64px; height: 64px">
        <img :src="NFT1.image_url" :alt="NFT1.name" width="512" height="512" />
      </div>
      {{ NFT1.name }}
      -
      {{ player1.name }}
    </div>

    <div class="battle-list-item-secondary">
      <template v-if="!player2">
        <div style="width: 64px; height: 64px">
          <img
            src="@/assets/images/blank-NFT.png"
            alt="OPPONENT WANTED"
            width="512"
            height="512"
          />
        </div>
        OPPONENT WANTED
      </template>
      <template v-else>
        <div style="width: 64px; height: 64px">
          <img
            :src="NFT2.image_url"
            :alt="NFT2.name"
            width="512"
            height="512"
          />
        </div>
        {{ player2.name }}'s {{ NFT2.name }}
      </template>
    </div>

    <div class="battle-list-item-actions">
      <BaseDialog
        :open="dialogShown"
        title="Select a NFT to use in battle"
        @close="onCloseDialog"
      >
        <SelectNFTs :player="player" @select="onSelectNFT" />
      </BaseDialog>

      <BaseButton v-if="isPlayerBattle" type="danger" @click="deleteBattle">
        DELETE
      </BaseButton>

      <BaseButton v-if="canJoinBattle" type="primary" @click="joinBattle">
        JOIN BATTLE
      </BaseButton>
    </div>
  </BaseListItem>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import SelectNFTs from '@/components/SelectNFTs'
import { BATTLE_STATE, NOTIFICATION_TYPE } from '@/utils/constants'

export default {
  name: 'BattleListItem',

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

    BATTLE_STATE() {
      return BATTLE_STATE
    },

    player1() {
      return this.findPlayer(this.battle.players[1].id)
    },

    player2() {
      return this.findPlayer(this.battle.players[2].id)
    },

    NFT1() {
      return this.findNFT(this.battle.players[1].NFT_id)
    },

    NFT2() {
      return this.findNFT(this.battle.players[2].NFT_id)
    },

    canJoinBattle() {
      return (
        !this.hasPlayerBattle &&
        !this.isPlayerBattle &&
        this.battle.state === BATTLE_STATE.CREATED
      )
    },

    hasPlayerBattle() {
      return this.playerBattle !== null
    },

    isPlayerBattle() {
      return this.playerBattle && this.playerBattle.id === this.battle.id
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
