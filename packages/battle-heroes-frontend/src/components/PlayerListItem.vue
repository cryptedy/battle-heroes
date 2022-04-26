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
      <template v-if="isPlayer">
        <template v-if="isPlayerStateIdle">
          <BattleCreateButton />
        </template>

        <template v-if="isPlayerStateBattle && playerBattle">
          <div v-if="playerNFT" style="display: flex; height: 36px">
            <img
              style="
                width: 100%;
                height: auto;
                border-radius: 2px;
                margin-right: 12px;
              "
              :src="playerNFT.image_url"
              :alt="playerNFT.name"
              width="512"
              height="512"
            />

            <BattleDeleteButton />
          </div>
        </template>

        <template v-else-if="isPlayerStateStandby && playerBattle">
          <div v-if="playerNFT" style="display: flex; height: 36px">
            <img
              style="
                width: 100%;
                height: auto;
                border-radius: 2px;
                margin-right: 12px;
              "
              :src="playerNFT.image_url"
              :alt="playerNFT.name"
              width="512"
              height="512"
            />

            <BattleDeleteButton />
          </div>
        </template>
      </template>

      <template v-else>
        <template v-if="playerBattle && playerNFT && opponentPlayerNFT">
          <div style="display: flex; height: 36px">
            <img
              style="
                width: 100%;
                height: auto;
                border-radius: 2px;
                margin-right: 12px;
              "
              :src="playerNFT.image_url"
              :alt="playerNFT.name"
              width="512"
              height="512"
            />

            <span style=""> VS </span>

            <img
              style="
                width: 100%;
                height: auto;
                border-radius: 2px;
                margin-left: 12px;
              "
              :src="opponentPlayerNFT.image_url"
              :alt="opponentPlayerNFT.name"
              width="512"
              height="512"
            />
          </div>
        </template>

        <template v-else-if="isPlayerStateStandby && playerBattle">
          <div v-if="playerNFT" style="display: flex; height: 36px">
            <img
              style="
                width: 100%;
                height: auto;
                border-radius: 2px;
                margin-right: 12px;
              "
              :src="playerNFT.image_url"
              :alt="playerNFT.name"
              width="512"
              height="512"
            />

            <BattleJoinButton :battle="playerBattle" />
          </div>
        </template>
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

    playerBattle() {
      return this.battleByPlayer(this.player)
    },

    playerKey() {
      const playerKey = Object.keys(this.playerBattle.players).find(
        playerKey => this.playerBattle.players[playerKey].id === this.player.id
      )

      return Number.parseInt(playerKey)
    },

    playerNFTId() {
      return this.playerBattle.players[this.playerKey].NFT_id
    },

    playerNFT() {
      return this.findNFT(this.playerNFTId)
    },

    opponentPlayerKey() {
      return this.playerKey === 1 ? 2 : 1
    },

    opponentPlayerNFTId() {
      return this.playerBattle.players[this.opponentPlayerKey].NFT_id
    },

    opponentPlayerNFT() {
      return this.findNFT(this.opponentPlayerNFTId)
    }
  }
}
</script>
