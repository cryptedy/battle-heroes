<template>
  <div class="battle">
    <template v-if="!battle">
      <p>The battle not found</p>
      <p>
        <router-link
          :to="{ name: 'battles' }"
          style="font-weight: bold; color: #2196f3"
        >
          <FontAwesomeIcon icon="arrow-left" />
          Back to battle list
        </router-link>
      </p>
    </template>

    <template v-else-if="!game">
      <p>GAME LOADING...</p>
      <p>{{ player1.name }} VS {{ player2.name }}</p>
    </template>

    <template v-else>
      <div class="battle-status">
        <div class="battle-status-actions">
          <BaseButton
            :type="isGameFinished ? 'primary' : 'danger'"
            @click="abortGame"
          >
            <FontAwesomeIcon icon="arrow-left" />
          </BaseButton>
        </div>

        <div class="battle-status-primary">
          <template v-if="isGameFinished">
            <p
              v-if="playerStatus.hp > opponentStatus.hp"
              style="font-weight: bold; color: #4caf50"
            >
              YOU WINI!
            </p>
            <p v-else style="font-weight: bold; color: #f44336">YOU LOSE!</p>
          </template>
          <p>
            TURN {{ game.turn }}
            <template v-if="!isGameFinished">
              <p v-if="canMove" style="font-weight: bold; color: #2196f3">
                Select your move!
              </p>
              <p v-else style="color: rgba(255, 255, 255, 0.5)">
                Waiting for opponent...
              </p>
            </template>
          </p>
          <p v-if="isGameFinished">
            <router-link
              :to="{ name: 'battles' }"
              style="font-weight: bold; color: #2196f3"
            >
              <FontAwesomeIcon icon="arrow-left" />
              Back to battle list
            </router-link>
          </p>
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
    </template>
  </div>
</template>

<script>
import BGM from '@/assets/audio/battle.mp3'
import { mapGetters, mapActions } from 'vuex'
import HealthBar from '@/components/HealthBar'
import { scrollToBottom } from '@/utils/helpers'
import { PLAYER_MOVE, NOTIFICATION_TYPE } from '@/utils/constants'

export default {
  name: 'Game',

  components: {
    HealthBar
  },

  unwatch: {
    playerHp: null,
    opponentHp: null,
    isGameFinished: null
  },

  // eslint-disable-next-line no-unused-vars
  beforeRouteLeave(to, from) {
    if (!this.aborting && this.game && !this.isGameFinished) {
      window.confirm('You cannot leave this page during the battle.')

      return false
    }
  },

  data() {
    return {
      loading: false,
      battle: null,
      game: null,
      playerState: {
        takingDamage: false
      },
      opponentState: {
        takingDamage: false
      },
      audio: new Audio(BGM),
      soundPaused: true,
      aborting: false
    }
  },

  computed: {
    ...mapGetters({
      findNFT: 'NFT/find',
      player: 'game/player',
      findBattle: 'battle/find',
      findPlayer: 'player/find'
    }),

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

    canMove() {
      return (
        !this.loading &&
        !this.isGameFinished &&
        this.game.current_player === this.playerKey
      )
    }
  },

  created() {
    this.audio.currentTime = 0
  },

  beforeMount() {
    console.log('beforeMount')
  },

  mounted() {
    console.log('mounted')

    const battle = this.findBattle(this.$route.params.battleId)

    if (battle) {
      if (
        !Object.keys(battle.players).some(
          playerKey => battle.players[playerKey].id === null
        )
      ) {
        this.battle = battle

        this.$socket.emit('game:start', this.battle.id, this.onGameStart)
      }
    }
  },

  beforeUnmount() {
    console.log('beforeUnmount')

    this.unwatch()

    this.$socket.off('game:update')

    this.audio.pause()
  },

  methods: {
    ...mapActions({
      removeBattle: 'battle/remove',
      addNotification: 'notification/add'
    }),

    attack() {
      if (!this.canMove) return

      this.loading = true

      this.$socket.emit('player:move', PLAYER_MOVE.ATTACK)
    },

    onGameStart({ status, game }) {
      console.log('game:start', status, game)

      if (!status) {
        return this.addNotification({
          message: 'Failed to update the game',
          type: NOTIFICATION_TYPE.ERROR
        })
      }

      this.$socket.on('game:update', this.onGameUpdate)

      this.game = game

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

      this.$nextTick(() => scrollToBottom(this.$refs.messages, false))
    },

    onGameUpdate(game) {
      this.game = game

      this.$nextTick(() => scrollToBottom(this.$refs.messages, true))

      this.loading = false
    },

    onGameFinished() {
      this.unwatch()

      if (this.playerHp > this.opponentHp) {
        this.game.messages.push('You win! got 3 exp.')
      } else {
        this.game.messages.push('You lose... got 1 exp.')
      }

      this.$socket.emit('game:finish', this.game.id)
      // eslint-disable-next-line no-unused-vars
      this.$socket.emit('battle:delete', this.battle.id, status => {})
    },

    abortGame() {
      if (this.game && !this.isGameFinished) {
        const answer = window.confirm('Abort the game?')

        if (!answer) return false
      }

      this.aborting = true

      this.$socket.emit('game:finish', this.game.id)
      // eslint-disable-next-line no-unused-vars
      this.$socket.emit('battle:delete', this.battle.id, status => {
        if (status) {
          this.$router.push(
            {
              name: 'battles'
            },
            () => {}
          )
        }
      })
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
