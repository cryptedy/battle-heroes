<template>
  <div class="battle">
    <template v-if="!battle">
      <p>Battle not found.</p>
      <p>
        <router-link :to="{ name: 'battles' }">BATTLE LIST</router-link>
      </p>
    </template>

    <!-- <template v-else-if="isBattleEnded">
      <p>The battle is over</p>
      <p>
        <router-link :to="{ name: 'battles' }">BATTLE LIST</router-link>
      </p>

      <template v-if="game">
        <p v-if="playerStatus.hp > opponentStatus.hp">YOU WINI!</p>
        <p v-else>YOU LOSE!</p>
      </template>
    </template> -->

    <template v-else-if="!game">
      <p>GAME LOADING...</p>

      <p>
        {{ player1.name }}
      </p>
      <p>
        {{ NFT1.name }}
      </p>
      <p>
        <img :src="NFT1.image_url" :alt="NFT1.name" width="512" height="512" />
      </p>

      <p>VS</p>

      <p>
        {{ player2.name }}
      </p>
      <p>
        {{ NFT2.name }}
      </p>
      <p>
        <img :src="NFT2.image_url" :alt="NFT2.name" width="512" height="512" />
      </p>
    </template>

    <template v-else>
      <div class="battle-ground">
        <div
          class="battle-ground-player"
          :class="{ 'is-current-turn': !canMove }"
        >
          <div>
            <span v-if="canMove"> YOUR TURN </span>
            <span v-else> WAIT FOR OPPONENT MOVE </span>
          </div>

          <div class="battle-ground-player-name">
            {{ opponentPlayer.name }}
          </div>

          <div class="battle-ground-nft">
            <div class="battle-ground-nft-name">
              {{ opponentNFT.name }}
            </div>
            <div class="battle-ground-nft-image">
              <img
                :src="opponentNFT.image_url"
                alt=""
                width="512"
                height="512"
              />
            </div>
            <div class="battle-health-bar">
              HP => {{ opponentStatus.hp }} / {{ opponentStatus.max_hp }}
            </div>
            <div class="battle-ground-nft-status">
              <ul>
                <li>Attack => {{ opponentStatus.attack }}</li>
                <li>Defense => {{ opponentStatus.defense }}</li>
                <li>Speed => {{ opponentStatus.speed }}</li>
              </ul>
            </div>
            <div class="battle-ground-nft-attributes">
              <ul>
                <li
                  v-for="opponentNFTAttribute in opponentNFT.attributes"
                  :key="opponentNFTAttribute.trait_type"
                >
                  {{ opponentNFTAttribute.trait_type }} =>
                  {{ opponentNFTAttribute.value }}
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div
          class="battle-ground-player"
          :class="{ 'is-current-turn': canMove }"
        >
          <div>
            <span v-if="canMove"> YOUR TURN </span>
            <span v-else> WAIT FOR OPPONENT MOVE </span>
          </div>

          <div class="battle-ground-player-name">
            {{ player.name }}
          </div>

          <div class="battle-ground-nft">
            <div class="battle-ground-nft-name">
              {{ playerNFT.name }}
            </div>
            <div class="battle-ground-nft-image">
              <img :src="playerNFT.image_url" alt="" width="512" height="512" />
            </div>
            <div class="battle-health-bar">
              HP => {{ playerStatus.hp }} / {{ playerStatus.max_hp }}
            </div>
            <div class="battle-ground-nft-status">
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
            </div>
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
        <ul>
          <li>
            <button :disabled="!canMove" @click="attack">ATTACK</button>
          </li>
          <li>
            <button :disabled="!canMove">SPELL</button>
          </li>
          <li>
            <button :disabled="!canMove">DEFFENCE</button>
          </li>
          <li>
            <button :disabled="!canMove">RUN</button>
          </li>
        </ul>
      </div>

      <div class="battle-foo">
        <template v-if="isBattleEnded">
          <p v-if="playerStatus.hp > opponentStatus.hp">YOU WINI!</p>
          <p v-else>YOU LOSE!</p>
        </template>

        <p>BATTLE STATE: {{ battle.state }}</p>
        <p>PLAYER KEY: {{ playerKey }}</p>
        <p>TURN: {{ game.turn }}</p>
        <p>CURRENT_PLAYER: {{ game.current_player }}</p>
        <p>CAN MOVE: {{ canMove }}</p>
      </div>
    </template>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { PLAYER_MOVE, BATTLE_STATE } from '@/utils/constants'

export default {
  name: 'Battle',

  // eslint-disable-next-line no-unused-vars
  beforeRouteLeave(to, from) {
    const answer = window.confirm('Do you really want to leave?')

    if (!answer) return false
  },

  data() {
    return {
      game: null,
      loading: false
    }
  },

  computed: {
    ...mapGetters({
      findNFT: 'NFT/find',
      player: 'game/player',
      findBattle: 'battle/find',
      findPlayer: 'player/find'
    }),

    battle() {
      return this.findBattle(this.$route.params.battleId)
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

    opponentStatus() {
      return this.game.players[this.opponentPlayerKey]
    },

    isBattleEnded() {
      return this.battle.state === BATTLE_STATE.ENDED
    },

    canMove() {
      return (
        !this.isBattleEnded &&
        !this.loading &&
        this.game.current_player === this.playerKey
      )
    }
  },

  mounted() {
    if (this.battle) {
      this.$socket.emit('battle:start', this.battle.id, ({ status, game }) => {
        console.log('battle:start', status, game)

        if (status) {
          this.$socket.on('game:update', game => {
            console.log('game:update', game)
            this.game = game

            this.$nextTick(() => this.scrollToBottom())

            this.loading = false
          })

          this.game = game
          this.$nextTick(() => this.scrollToBottom(false))

          // setTimeout(() => {
          //   this.game = game
          //   this.$nextTick(() => this.scrollToBottom(false))
          // }, 5000)
        }
      })
    }
  },

  beforeMount() {
    // if (this.isBattleEnded) {
    //   this.$socket.emit('battle:leave', this.battle.id)
    // }

    this.$socket.off('game:update')
  },

  methods: {
    attack() {
      if (!this.canMove) return

      this.loading = true

      this.$socket.emit('player:move', PLAYER_MOVE.ATTACK)
    },

    scrollToBottom(smooth = true) {
      try {
        if (smooth) {
          this.$refs.messages.scrollTo({
            top: this.$refs.messages.scrollHeight,
            behavior: 'smooth'
          })
        } else {
          this.$refs.messages.scrollTo(0, this.$refs.messages.scrollHeight)
        }
        // eslint-disable-next-line no-empty
      } catch (error) {}
    }

    // leaveBattle() {
    //   if (this.isBattleEnded) {
    //     this.$socket.emit('battle:leave', this.battle.id)
    //   }
    //   this.$router.push(
    //     {
    //       name: 'home'
    //     },
    //     () => {}
    //   )
    // }
  }
}
</script>
