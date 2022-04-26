<template>
  <BaseListItem class="battle-list-item">
    <div class="battle-list-item-primary">
      <div style="width: 64px; height: 64px">
        <img :src="NFT1.image_url" :alt="NFT1.name" width="512" height="512" />
      </div>
      <p>{{ player1.name }}</p>
      <p>{{ NFT1.name }}</p>
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
        <p>OPPONENT WANTED</p>
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
        <p>{{ player2.name }}</p>
        <p>{{ NFT2.name }}</p>
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

      <BaseButton v-if="canDeleteBattle" type="danger" @click="deleteBattle">
        DELETE
      </BaseButton>

      <BaseButton v-if="canJoinBattle" type="primary" @click="joinBattle">
        JOIN
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

    isPlayerBattle() {
      return this.playerBattle && this.playerBattle.id === this.battle.id
    },

    canJoinBattle() {
      return (
        !this.playerBattle &&
        !this.isPlayerBattle &&
        this.battle.state === BATTLE_STATE.CREATED
      )
    },

    canDeleteBattle() {
      return this.isPlayerBattle
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
      this.$socket.emit(
        'battle:delete',
        this.playerBattle.id,
        ({ status, message }) => {
          if (status) {
            this.addNotification({
              message,
              type: NOTIFICATION_TYPE.SUCCESS
            })
          } else {
            this.addNotification({
              message,
              type: NOTIFICATION_TYPE.ERROR,
              timeout: 0
            })
          }
        }
      )
    }
  }
}
</script>
