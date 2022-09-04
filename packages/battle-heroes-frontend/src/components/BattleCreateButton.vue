<template>
  <SplashScreen v-if="splashScreenShown" message="Loading..." />

  <BaseDialog
    :open="NFTDialogShown"
    title="バトルを開始"
    :padding-top="false"
    @close="onCloseNFTDialog"
  >
    <BaseDialog
      :open="playerDialogShown"
      title="対戦相手を指定"
      :padding-top="false"
      :padding-right="false"
      :padding-bottom="false"
      :padding-left="false"
      @close="onClosePlayerDialog"
    >
      <SelectPlayers :players="availablePlayers" @select="onSelectPlayer" />
    </BaseDialog>

    <h2 class="subheader">1. 対戦相手を選択</h2>

    <div class="player-select">
      <div class="player-list">
        <div class="player-list-item">
          <template v-if="!selectedOpponentPlayer">
            <div class="player-list-item-secondary">
              <p>
                <strong> 対戦相手指定なし </strong>
              </p>
              <p>ランダムマッチングバトル</p>
            </div>

            <div class="player-list-item-actions">
              <BaseButton
                v-if="canStartBattle"
                type="primary"
                :disabled="loading || !Object.keys(availablePlayers).length > 0"
                @click="selectPlayers"
              >
                <template v-if="Object.keys(availablePlayers).length > 0">
                  対戦相手を指名
                </template>
                <template v-else> オンラインプレイヤーがいません </template>
              </BaseButton>
            </div>
          </template>

          <template v-else>
            <div class="player-list-item-primary">
              <PlayerAvatar :player="selectedOpponentPlayer" />
            </div>

            <div class="player-list-item-secondary">
              <div
                class="player-name"
                :class="{
                  'is-online': selectedOpponentPlayer.socket_ids.length > 0
                }"
              >
                {{ selectedOpponentPlayer.name }}

                <span class="player-devices">
                  {{ selectedOpponentPlayer.socket_ids.length }}
                </span>
              </div>

              <PlayerStats :player="selectedOpponentPlayer" />
            </div>

            <div class="player-list-item-actions">
              <BaseButton type="danger" @click="onDeselectPlayer">
                指名をやめる
              </BaseButton>
            </div>
          </template>
        </div>
      </div>
    </div>

    <h2 class="subheader">2. バトルに使用する NFT を選択</h2>

    <SelectNFTs :player="player" @select="onSelectNFT" />
  </BaseDialog>

  <BaseButton
    v-if="canStartBattle"
    type="primary"
    :disabled="loading"
    @click="handle"
  >
    {{ label }}
  </BaseButton>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import SelectNFTs from '@/components/SelectNFTs'
import PlayerStats from '@/components/PlayerStats'
import PlayerAvatar from '@/components/PlayerAvatar'
import SplashScreen from '@/components/SplashScreen'
import SelectPlayers from '@/components/SelectPlayers'
import {
  BATTLE_TYPE,
  BATTLE_STATE,
  PLAYER_STATE,
  NOTIFICATION_TYPE,
  BATTLE_SPLASH_SCREEN_TYPE
} from '@/utils/constants'
import BaseButton from './BaseButton.vue'

export default {
  name: 'BattleCreateButton',

  components: {
    SelectNFTs,
    PlayerStats,
    PlayerAvatar,
    SplashScreen,
    SelectPlayers,
    BaseButton
  },

  props: {
    nft: {
      type: Object,
      required: false,
      default: () => ({})
    },

    opponentPlayer: {
      type: Object,
      required: false,
      default: () => ({})
    },

    label: {
      type: String,
      required: false,
      default: 'バトルを開始'
    },

    timeout: {
      type: Number,
      required: false,
      default: 5000
    }
  },

  emits: ['created', 'joined'],

  data() {
    return {
      loading: false,
      splashScreenShown: false,
      playerDialogShown: false,
      NFTDialogShown: false,
      selectedOpponentPlayer: null
    }
  },

  computed: {
    ...mapGetters({
      battles: 'battle/all',
      player: 'game/player',
      players: 'player/allHuman',
      playerNFT: 'battle/playerNFT',
      playerBattle: 'game/playerBattle'
    }),

    canStartBattle() {
      return !this.playerBattle && this.player.state === PLAYER_STATE.IDLE
    },

    availableBattles() {
      return this.battles.filter(
        battle =>
          battle.type === BATTLE_TYPE.HUMAN &&
          battle.state === BATTLE_STATE.CREATED
      )
    },

    availablePlayers() {
      return this.players.filter(
        player => player.id !== this.player.id && player.socket_ids.length > 0
      )
    }
  },

  beforeMount() {
    if (Object.keys(this.opponentPlayer).length > 0) {
      this.selectedOpponentPlayer = this.opponentPlayer
    }
  },

  methods: {
    ...mapActions({
      joinBattle: 'battle/join',
      createBattle: 'battle/create',
      addNotification: 'notification/add'
    }),

    handle() {
      this.NFTDialogShown = true
    },

    selectPlayers() {
      this.playerDialogShown = true
    },

    onClosePlayerDialog() {
      this.playerDialogShown = false
    },

    onCloseNFTDialog() {
      this.NFTDialogShown = false
    },

    onSelectNFT(NFT) {
      this.NFTDialogShown = false

      this.execute(NFT)
    },

    onSelectPlayer(player) {
      console.log('onSelectPlayer', player)
      this.selectedOpponentPlayer = player

      this.playerDialogShown = false
    },

    onDeselectPlayer() {
      this.selectedOpponentPlayer = null
    },

    async execute(NFT) {
      this.loading = true
      this.splashScreenShown = true

      if (this.availableBattles.length > 0) {
        // join other battle
        // use oldest one
        const battle = this.availableBattles[0]

        this.joinBattle({ battleId: battle.id, NFTId: NFT.id })
          // eslint-disable-next-line no-unused-vars
          .then(({ message, battle, player1, player2 }) => {
            this.$router
              .push(
                {
                  name: 'battles.show',
                  params: {
                    battleId: battle.id,
                    splashScreenType: BATTLE_SPLASH_SCREEN_TYPE.MATCHING
                  }
                },
                () => {}
              )
              .then(() => {
                this.loading = false
                this.splashScreenShown = false

                this.$emit('joined', battle.id)
              })
          })
          .catch(error => {
            this.addNotification({
              message: error.message,
              type: NOTIFICATION_TYPE.ERROR,
              timeout: 0
            })

            this.loading = false
            this.splashScreenShown = false
          })
      } else {
        // create a new battle
        const opponentPlayerId = this.selectedOpponentPlayer
          ? this.selectedOpponentPlayer.id
          : null

        this.createBattle({
          NFTId: NFT.id,
          opponentPlayerId,
          timeout: this.timeout
        })
          // eslint-disable-next-line no-unused-vars
          .then(({ message, battle, player }) => {
            this.$router
              .push(
                {
                  name: 'battles.show',
                  params: {
                    battleId: battle.id,
                    splashScreenType: BATTLE_SPLASH_SCREEN_TYPE.MATCHING
                  }
                },
                () => {}
              )
              .then(() => {
                this.loading = false
                this.splashScreenShown = false

                this.$emit('created', battle.id)
              })
          })
          .catch(error => {
            this.addNotification({
              message: error,
              type: NOTIFICATION_TYPE.ERROR,
              timeout: 0
            })

            this.loading = false
            this.splashScreenShown = false
          })
      }
    }
  }
}
</script>
