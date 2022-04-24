<template>
  <TheLayoutGame>
    <ErrorScreen v-if="!battle" message="The battle not found">
      <p>
        The battle has already finished or the opponent player has ended the
        battle
      </p>
      <p style="margin-top: 16px">
        <BaseButton type="primary" @click="leaveGame">
          <FontAwesomeIcon icon="arrow-left" />
          BACK
        </BaseButton>
      </p>
    </ErrorScreen>

    <div v-else-if="isBattleCreated">
      <p>The battle not started</p>
      <p>{{ player1.name }}'s {{ NFT1.name }}</p>

      <template v-if="canJoinBattle">
        <BaseDialog
          :open="dialogShown"
          title="Select a NFT to use in battle"
          @close="onCloseDialog"
        >
          <SelectNFTs :player="player" @select="onSelectNFT" />
        </BaseDialog>

        <BaseButton v-if="canJoinBattle" type="primary" @click="joinBattle">
          JOIN BATTLE
        </BaseButton>
      </template>
    </div>

    <SplashScreen v-else-if="!game" message="Loading game...">
      <div style="text-align: center">
        <p>{{ player1.name }}'s {{ NFT1.name }}</p>
        <p>VS</p>
        <p>{{ player2.name }}'s {{ NFT2.name }}</p>
      </div>
    </SplashScreen>

    <div v-else class="battle">
      <div class="battle-status">
        <div class="battle-status-actions">
          <BaseButton v-if="canLeave" type="primary" @click="leaveGame">
            <FontAwesomeIcon icon="arrow-left" />
          </BaseButton>

          <BaseButton v-else type="danger" @click="abortGame">
            <FontAwesomeIcon icon="arrow-left" />
          </BaseButton>
        </div>

        <div class="battle-status-primary">
          <p>=== TURN {{ game.turn }} ===</p>

          <template v-if="aborted">
            <p style="font-weight: bold; color: #4caf50">YOU WINI!</p>
            <p>Opponent player aborted the battle.</p>
          </template>

          <template v-else-if="isGameFinished">
            <p
              v-if="playerStatus.hp > opponentStatus.hp"
              style="font-weight: bold; color: #4caf50"
            >
              YOU WINI!
            </p>
            <p v-else style="font-weight: bold; color: #f44336">YOU LOSE!</p>
            <router-link
              :to="{ name: 'battles' }"
              style="font-weight: bold; color: #2196f3"
            >
              <FontAwesomeIcon icon="arrow-left" />
              Back to battle list
            </router-link>
          </template>

          <template v-else>
            <p v-if="canMove" style="font-weight: bold; color: #2196f3">
              Select your move!
            </p>
            <p v-else style="color: rgba(255, 255, 255, 0.5)">
              Waiting for opponent...
            </p>
          </template>
        </div>

        <div class="battle-status-actions">
          <BaseButton
            :type="soundPaused ? 'default' : 'primary'"
            @click="toggleSound"
          >
            <FontAwesomeIcon v-if="soundPaused" icon="volume-xmark" />
            <FontAwesomeIcon v-else icon="volume-high" />
          </BaseButton>
        </div>
      </div>

      <div class="battle-ground">
        <div
          class="battle-ground-player"
          :class="{
            'is-current-turn': !canMove,
            'is-win': isGameFinished && playerStatus.hp < opponentStatus.hp,
            'is-lose': isGameFinished && playerStatus.hp > opponentStatus.hp,
            shake: opponentState.takingDamage
          }"
        >
          <div
            class="battle-ground-player-name player-name"
            :class="{
              'is-online': opponentPlayer.socket_ids.length > 0,
              'is-win': isGameFinished && playerStatus.hp < opponentStatus.hp,
              'is-lose': isGameFinished && playerStatus.hp > opponentStatus.hp
            }"
          >
            {{ opponentPlayer.name }}
          </div>

          <div class="battle-ground-nft">
            <div
              class="battle-ground-nft-name"
              :class="{
                'is-current-turn': !canMove,
                'is-win': isGameFinished && playerStatus.hp < opponentStatus.hp,
                'is-lose': isGameFinished && playerStatus.hp > opponentStatus.hp
              }"
            >
              <p>{{ opponentNFT.name }}</p>
              <!-- <p>RANK {{ opponentNFT.rank }}</p>
              <p>SCORE {{ opponentNFT.score }}</p> -->
            </div>
            <div
              class="battle-ground-nft-image"
              :class="{
                'is-win': isGameFinished && playerStatus.hp < opponentStatus.hp,
                'is-lose': isGameFinished && playerStatus.hp > opponentStatus.hp
              }"
            >
              <img
                :src="opponentNFT.image_url"
                alt=""
                width="512"
                height="512"
              />
            </div>
            <HealthBar
              :max-hp="opponentStatus.max_hp"
              :hp="opponentStatus.hp"
            />
            <div
              class="battle-ground-nft-status"
              :class="{
                'is-win': isGameFinished && playerStatus.hp < opponentStatus.hp,
                'is-lose': isGameFinished && playerStatus.hp > opponentStatus.hp
              }"
            >
              <ul>
                <li>
                  HP {{ opponentStatus.hp }} / {{ opponentStatus.max_hp }}
                </li>
                <li>ATTACK {{ opponentStatus.attack }}</li>
                <li>DEFENSE {{ opponentStatus.defense }}</li>
                <li>SPEED {{ opponentStatus.speed }}</li>
              </ul>
            </div>
            <!-- <div class="battle-ground-nft-attributes">
              <ul>
                <li
                  v-for="opponentNFTAttribute in opponentNFT.attributes"
                  :key="opponentNFTAttribute.trait_type"
                >
                  {{ opponentNFTAttribute.trait_type }} =>
                  {{ opponentNFTAttribute.value }}
                </li>
              </ul>
            </div> -->
          </div>
        </div>

        <div
          class="battle-ground-player"
          :class="{
            'is-current-turn': canMove,
            'is-win': isGameFinished && playerStatus.hp > opponentStatus.hp,
            'is-lose': isGameFinished && playerStatus.hp < opponentStatus.hp,
            shake: playerState.takingDamage
          }"
        >
          <div
            class="battle-ground-player-name player-name"
            :class="{
              'is-online': player.socket_ids.length > 0,
              'is-win': isGameFinished && playerStatus.hp > opponentStatus.hp,
              'is-lose': isGameFinished && playerStatus.hp < opponentStatus.hp
            }"
          >
            {{ player.name }}
          </div>

          <div class="battle-ground-nft">
            <div
              class="battle-ground-nft-name"
              :class="{
                'is-current-turn': canMove,
                'is-win': isGameFinished && playerStatus.hp > opponentStatus.hp,
                'is-lose': isGameFinished && playerStatus.hp < opponentStatus.hp
              }"
            >
              <p>{{ playerNFT.name }}</p>
              <!-- <p>RANK {{ playerNFT.rank }}</p>
              <p>SCORE {{ playerNFT.score }}</p> -->
            </div>
            <div
              class="battle-ground-nft-image"
              :class="{
                'is-win': isGameFinished && playerStatus.hp > opponentStatus.hp,
                'is-lose': isGameFinished && playerStatus.hp < opponentStatus.hp
              }"
            >
              <img :src="playerNFT.image_url" alt="" width="512" height="512" />
            </div>
            <HealthBar :max-hp="playerStatus.max_hp" :hp="playerStatus.hp" />
            <div
              class="battle-ground-nft-status"
              :class="{
                'is-win': isGameFinished && playerStatus.hp > opponentStatus.hp,
                'is-lose': isGameFinished && playerStatus.hp < opponentStatus.hp
              }"
            >
              <ul>
                <li>HP {{ playerStatus.hp }} / {{ playerStatus.max_hp }}</li>
                <li>ATTACK {{ playerStatus.attack }}</li>
                <li>DEFENSE {{ playerStatus.defense }}</li>
                <li>SPEED {{ playerStatus.speed }}</li>
              </ul>
            </div>
            <!-- <div class="battle-ground-nft-status">
              <ul>
                <li>Attack => {{ playerStatus.attack }}</li>
                <li>Defense => {{ playerStatus.defense }}</li>
                <li>Speed => {{ playerStatus.speed }}</li>
              </ul>
            </div>
            <div class="battle-ground-nft-attributes">
              <ul>
                <li
                  v-for="playerNFTAttribute in playerNFT.attributes"
                  :key="playerNFTAttribute.trait_type"
                >
                  {{ playerNFTAttribute.trait_type }} =>
                  {{ playerNFTAttribute.value }}
                </li>
              </ul>
            </div> -->
          </div>
        </div>
      </div>

      <div ref="messages" class="battle-messages">
        <ul>
          <li v-for="(message, index) in game.messages" :key="index">
            {{ message }}
          </li>
        </ul>
      </div>

      <div class="battle-controls">
        <button :disabled="!canMove" @click="attack">ATTACK</button>
        <button :disabled="true">SPELL</button>
        <button :disabled="true">DEFFENCE</button>
        <button :disabled="true">RUN</button>
      </div>
    </div>
  </TheLayoutGame>
</template>

<script>
import BGM from '@/assets/audio/battle.mp3'
import { mapGetters, mapActions } from 'vuex'
import HealthBar from '@/components/HealthBar'
import { scrollToBottom } from '@/utils/helpers'
import SelectNFTs from '@/components/SelectNFTs'
import ErrorScreen from '@/components/ErrorScreen'
import SplashScreen from '@/components/SplashScreen'
import TheLayoutGame from '@/components/TheLayoutGame'
import { PLAYER_MOVE, BATTLE_STATE, NOTIFICATION_TYPE } from '@/utils/constants'

export default {
  name: 'Game',

  components: {
    HealthBar,
    SelectNFTs,
    ErrorScreen,
    SplashScreen,
    TheLayoutGame
  },

  unwatch: {
    playerHp: null,
    opponentHp: null,
    isGameFinished: null
  },

  // eslint-disable-next-line no-unused-vars
  beforeRouteLeave(to, from) {
    if (this.game && !this.aborting && !this.canLeave) {
      window.confirm('You cannot leave this page during the battle.')

      return false
    }
  },

  data() {
    return {
      dialogShown: false,

      loading: false,

      battleCache: null,

      game: null,
      aborting: false,
      aborted: false,

      playerState: {
        takingDamage: false
      },
      opponentState: {
        takingDamage: false
      },

      audio: new Audio(BGM),
      soundPaused: true
    }
  },

  computed: {
    ...mapGetters({
      findNFT: 'NFT/find',
      player: 'game/player',
      findBattle: 'battle/find',
      findPlayer: 'player/find',
      playerBattle: 'game/playerBattle'
    }),

    battle() {
      return this.findBattle(this.$route.params.battleId) || this.battleCache
    },

    hasPlayerBattle() {
      return this.playerBattle !== null
    },

    isPlayerBattle() {
      return this.playerBattle && this.playerBattle.id === this.battle.id
    },

    isBattleCreated() {
      return this.battle.state === BATTLE_STATE.CREATED
    },

    isBattleReady() {
      return this.battle.state === BATTLE_STATE.READY
    },

    isBattleStarted() {
      return this.battle.state === BATTLE_STATE.STARTED
    },

    isBattleEnded() {
      return this.battle.state === BATTLE_STATE.ENDED
    },

    battlePlayersJoined() {
      return !Object.keys(this.battle.players).some(
        playerKey => this.battle.players[playerKey].id === null
      )
    },

    canJoinBattle() {
      return (
        !this.hasPlayerBattle &&
        !this.isPlayerBattle &&
        this.isBattleCreated &&
        !this.battlePlayersJoined
      )
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

    playerKey() {
      const playerKey = Object.keys(this.battle.players).find(
        playerKey => this.battle.players[playerKey].id === this.player.id
      )

      return Number.parseInt(playerKey)
    },

    opponentPlayerKey() {
      return this.playerKey === 1 ? 2 : 1
    },

    opponentPlayerId() {
      return this.battle.players[this.opponentPlayerKey].id
    },

    opponentPlayer() {
      return this.findPlayer(this.opponentPlayerId)
    },

    playerNFTId() {
      return this.battle.players[this.playerKey].NFT_id
    },

    opponentNFTId() {
      return this.battle.players[this.opponentPlayerKey].NFT_id
    },

    playerNFT() {
      return this.findNFT(this.playerNFTId)
    },

    opponentNFT() {
      return this.findNFT(this.opponentNFTId)
    },

    playerStatus() {
      return this.game.players[this.playerKey]
    },

    playerHp() {
      return this.playerStatus.hp
    },

    opponentStatus() {
      return this.game.players[this.opponentPlayerKey]
    },

    opponentHp() {
      return this.opponentStatus.hp
    },

    isGameFinished() {
      return this.playerHp <= 0 || this.opponentHp <= 0
    },

    canLeave() {
      return !(!this.aborted && !this.isGameFinished)
    },

    canMove() {
      return (
        !this.loading &&
        !this.aborted &&
        !this.isGameFinished &&
        this.game.current_player === this.playerKey
      )
    }
  },

  created() {
    console.log('Game:created')

    this.$socket.on('battle:matched', battleId =>
      this.onBattleMatched(battleId)
    )
    this.$socket.on('game:aborted', gameId => this.onGameAborted(gameId))

    this.audio.currentTime = 0
  },

  beforeMount() {
    console.log('Game:beforeMount')
  },

  mounted() {
    console.log('Game:mounted')

    if (this.battle && (this.isBattleReady || this.isBattleStarted)) {
      this.$socket.emit('game:start', this.battle.id, this.onGameStart)
    }
  },

  beforeUnmount() {
    console.log('Game:beforeUnmount')

    this.unwatch()
    this.removeEventListener()

    this.audio.pause()
  },

  methods: {
    ...mapActions({
      removeBattle: 'battle/remove',
      addNotification: 'notification/add'
    }),

    attack() {
      console.log('attack')

      if (!this.canMove) return

      this.loading = true

      this.$socket.emit('game:move', PLAYER_MOVE.ATTACK)
    },

    leaveGame() {
      console.log('leaveGame')

      return this.$router.push(
        {
          name: 'battles'
        },
        () => {}
      )
    },

    abortGame() {
      console.log('abortGame')

      if (!this.canLeave) {
        const answer = window.confirm('Abort the game and you lose.')

        if (!answer) return false
      }

      this.aborting = true

      if (this.game) {
        // eslint-disable-next-line no-unused-vars
        this.$socket.emit('game:abort', this.game.id, ({ status }) => {
          this.leaveGame().then(() => {
            this.aborting = false
          })
        })
      }
    },

    onGameStart({ status, game }) {
      console.log('onGameUpdate', status, game)

      if (!status) {
        return this.addNotification({
          message: 'Failed to update the game',
          type: NOTIFICATION_TYPE.ERROR,
          timeout: 0
        })
      }

      this.battleCache = this.battle

      this.game = game

      this.watch()

      this.$socket.on('game:update', this.onGameUpdate)

      this.$nextTick(() => scrollToBottom(this.$refs.messages, false))
    },

    onGameUpdate(game) {
      console.log('onGameUpdate', game)

      this.game = game

      this.$nextTick(() => scrollToBottom(this.$refs.messages, true))

      this.loading = false
    },

    onGameFinished() {
      console.log('onGameFinished')

      this.unwatch()
      this.removeEventListener()

      if (this.playerHp > this.opponentHp) {
        this.game.messages.push('=== You win! got 3 exp ===')
      } else {
        this.game.messages.push('=== You lose... got 1 exp ===')
      }

      this.$socket.emit('game:finish', this.game.id)
    },

    onGameAborted(gameId) {
      console.log('onGameAborted', gameId)

      if (gameId === this.game.id) {
        this.aborted = true

        this.game.messages.push('=== Opponent player aborted the game ===')
        this.game.messages.push('=== You win! got 3 exp ===')

        this.addNotification({
          message: 'Opponent player aborted the game',
          type: NOTIFICATION_TYPE.ERROR,
          timeout: 0
        })
      }
    },

    onBattleMatched(battleId) {
      console.log('onBattleMatched', battleId, this.battle.id)

      if (battleId === this.battle.id) {
        this.$socket.emit('game:start', this.battle.id, this.onGameStart)
      } else {
        this.$router.push(
          {
            name: 'game',
            params: {
              battleId: battleId
            }
          },
          () => {}
        )
      }
    },

    joinBattle() {
      this.dialogShown = true
    },

    onCloseDialog() {
      this.dialogShown = false
    },

    onSelectNFT(NFT) {
      this.$socket.emit('battle:join', this.battle.id, NFT.id)

      this.dialogShown = false
    },

    toggleSound() {
      if (this.soundPaused) {
        this.audio.play()
        this.soundPaused = false
      } else {
        this.audio.pause()
        this.soundPaused = true
      }
    },

    removeEventListener() {
      this.$socket.off('game:update')
      this.$socket.off('game:aborted')
      this.$socket.off('battle:matched')
    },

    watch() {
      if (!this.game) return

      this.$options.unwatch.playerHp = this.$watch(
        'playerHp',
        (value, oldValue) => {
          console.log('watch:playerHp', value, oldValue)

          if (value < oldValue) {
            this.playerState.takingDamage = true
            setTimeout(() => {
              this.playerState.takingDamage = false
            }, 400)
          }
        }
      )

      this.$options.unwatch.opponentHp = this.$watch(
        'opponentHp',
        (value, oldValue) => {
          console.log('watch:opponentHp', value, oldValue)

          if (value < oldValue) {
            this.opponentState.takingDamage = true
            setTimeout(() => {
              this.opponentState.takingDamage = false
            }, 400)
          }
        }
      )

      this.$options.unwatch.isGameFinished = this.$watch(
        'isGameFinished',
        (value, oldValue) => {
          if (value & !oldValue) this.onGameFinished()
        }
      )
    },

    unwatch() {
      Object.keys(this.$options.unwatch).forEach(key => {
        if (this.$options.unwatch[key]) {
          this.$options.unwatch[key]()
          this.$options.unwatch[key] = null
        }
      })
    }
  }
}
</script>
