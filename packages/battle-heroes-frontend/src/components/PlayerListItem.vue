<template>
  <BaseListItem class="player-list-item">
    <div class="player-list-item-primary">
      <BaseDrawer direction="bottom" :title="player.name">
        <template #trigger>
          <PlayerAvatar :player="player" />
        </template>

        <PlayerDetail :player="player" />

        <NFTList :player="player" />
      </BaseDrawer>
    </div>

    <div class="player-list-item-secondary">
      <div
        class="player-name"
        :class="{ 'is-online': player.socket_ids.length > 0 }"
      >
        <BaseDrawer direction="bottom" :title="player.name">
          <template #trigger>
            {{ player.name }}
          </template>

          <PlayerDetail :player="player" />

          <NFTList :player="player" />
        </BaseDrawer>

        <span class="player-devices">
          {{ player.socket_ids.length }}
        </span>
      </div>

      <PlayerStats :player="player" />
    </div>

    <div class="player-list-item-actions">
      <template v-if="battle">
        <template v-if="playerNFT">
          <img
            :src="playerNFT.image_url"
            :alt="playerNFT.name"
            width="42"
            height="42"
          />

          <template v-if="opponentPlayerKey && opponentPlayerNFT">
            <template v-if="playerNFT"> VS </template>

            <img
              :src="opponentPlayerNFT.image_url"
              :alt="opponentPlayerNFT.name"
              width="42"
              height="42"
            />
          </template>
        </template>
      </template>

      <template v-if="isPlayer">
        <BattleCreateButton />

        <BattleDeleteButton v-if="battle" :battle="battle" />
      </template>

      <template v-else-if="battle">
        <BattleJoinButton :battle="battle" />
      </template>
    </div>
  </BaseListItem>
</template>

<script>
import { mapGetters } from 'vuex'
import NFTList from '@/components/NFTList'
import { PLAYER_STATE } from '@/utils/constants'
import PlayerStats from '@/components/PlayerStats'
import PlayerAvatar from '@/components/PlayerAvatar'
import PlayerDetail from '@/components/PlayerDetail'
import BattleJoinButton from '@/components/BattleJoinButton'
import BattleCreateButton from '@/components/BattleCreateButton'
import BattleDeleteButton from '@/components/BattleDeleteButton'

export default {
  name: 'PlayerListItem',

  components: {
    NFTList,
    PlayerStats,
    PlayerAvatar,
    PlayerDetail,
    BattleJoinButton,
    BattleCreateButton,
    BattleDeleteButton
  },

  props: {
    player: {
      type: Object,
      required: true
    }
  },

  computed: {
    ...mapGetters({
      findNFT: 'NFT/find',
      findBattle: 'battle/find',
      gamePlayer: 'game/player',
      battleByPlayer: 'battle/byPlayer'
    }),

    isPlayer() {
      return this.gamePlayer.id === this.player.id
    },

    isPlayerStateIdle() {
      return this.player.state === PLAYER_STATE.IDLE
    },

    isPlayerStateStandby() {
      return this.player.state === PLAYER_STATE.STANDBY
    },

    isPlayerStateBattle() {
      return this.player.state === PLAYER_STATE.BATTLE
    },

    battle() {
      return this.battleByPlayer(this.player)
    },

    playerKey() {
      const playerKey = Object.keys(this.battle.players).find(
        playerKey => this.battle.players[playerKey].id === this.player.id
      )

      return Number.parseInt(playerKey)
    },

    playerNFTId() {
      return this.battle.players[this.playerKey].NFT_id
    },

    playerNFT() {
      return this.findNFT(this.playerNFTId)
    },

    opponentPlayerKey() {
      return this.playerKey === 1 ? 2 : 1
    },

    opponentPlayerNFTId() {
      return this.battle.players[this.opponentPlayerKey].NFT_id
    },

    opponentPlayerNFT() {
      return this.findNFT(this.opponentPlayerNFTId)
    }
  }
}
</script>
