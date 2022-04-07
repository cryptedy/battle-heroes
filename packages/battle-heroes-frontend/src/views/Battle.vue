<template>
  <div class="battle">
    <div v-if="!battle">
      <p>Battle not found.</p>
      <router-link :to="{ name: 'home' }"> Back to home </router-link>
    </div>

    <div v-else-if="starting">
      <p>BATTLE START!</p>

      <div>
        <p>
          {{ player1.name }}
        </p>
        <p>
          {{ NFT1.name }}
        </p>
        <p>
          <img :src="NFT1.image_url" alt="" width="512" height="512" />
        </p>

        <p>VS</p>

        <p>
          {{ player2.name }}
        </p>
        <p>
          {{ NFT2.name }}
        </p>
        <p>
          <img :src="NFT2.image_url" alt="" width="512" height="512" />
        </p>
      </div>
    </div>

    <template v-else>
      <div class="battle-ground">
        <p>TURN: {{ battle.turn }}</p>

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
              {{ opponentStatus.hp }} / {{ opponentStatus.max_hp }}
            </div>
            <!-- <div class="battle-ground-nft-status">
              <ul>
                <li>
                  <dl>
                    <dt>Attack</dt>
                    <dd>{{ opponentStatus.attack }}</dd>
                  </dl>
                </li>
                <li>
                  <dl>
                    <dt>Defense</dt>
                    <dd>{{ opponentStatus.defense }}</dd>
                  </dl>
                </li>
                <li>
                  <dl>
                    <dt>Speed</dt>
                    <dd>{{ opponentStatus.speed }}</dd>
                  </dl>
                </li>
              </ul>
            </div> -->
            <!-- <div class="battle-ground-nft-attributes">
              <ul class="nft-attribute-list">
                <li
                  v-for="opponentNFTAttribute in opponentNFT.attributes"
                  :key="opponentNFTAttribute.trait_type"
                  class="nft-attribute-list-item"
                >
                  <dl class="nft-attribute">
                    <dt class="nft-attribute-type">
                      {{ opponentNFTAttribute.trait_type }}
                    </dt>
                    <dd class="nft-attribute-value">
                      {{ opponentNFTAttribute.value }}
                    </dd>
                  </dl>
                </li>
              </ul>
            </div> -->
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
              {{ playerStatus.hp }} / {{ playerStatus.max_hp }}
            </div>
            <!-- <div class="battle-ground-nft-status">
              <ul>
                <li>
                  <dl>
                    <dt>Attack</dt>
                    <dd>{{ playerStatus.attack }}</dd>
                  </dl>
                </li>
                <li>
                  <dl>
                    <dt>Defense</dt>
                    <dd>{{ playerStatus.defense }}</dd>
                  </dl>
                </li>
                <li>
                  <dl>
                    <dt>Speed</dt>
                    <dd>{{ playerStatus.speed }}</dd>
                  </dl>
                </li>
              </ul>
            </div> -->
            <!-- <div class="battle-ground-nft-attributes">
              <ul class="nft-attribute-list">
                <li
                  v-for="playerNFTAttribute in playerNFT.attributes"
                  :key="playerNFTAttribute.trait_type"
                  class="nft-attribute-list-item"
                >
                  <dl class="nft-attribute">
                    <dt class="nft-attribute-type">
                      {{ playerNFTAttribute.trait_type }}
                    </dt>
                    <dd class="nft-attribute-value">
                      {{ playerNFTAttribute.value }}
                    </dd>
                  </dl>
                </li>
              </ul>
            </div> -->
          </div>
        </div>
      </div>

      <div class="battle-messages">
        <p v-if="isEnded">GAME OVER</p>

        <ul>
          <!-- <li v-for="index in 100" :key="index">BATTLE MESSAGE #{{ index }}</li> -->
          <li v-for="(message, index) in battle.messages" :key="index">
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
    </template>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { PLAYER_MOVE, BATTLE_STATE } from '@/utils/constants'

export default {
  name: 'Battle',

  data() {
    return {
      starting: false
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
      return this.findNFT(this.battle.NFTs[1].id)
    },

    NFT2() {
      return this.findNFT(this.battle.NFTs[2].id)
    },

    playerNumber() {
      return this.battle.players[1].id === this.player.id ? 1 : 2
    },

    playerNFT() {
      return this.findNFT(this.battle.NFTs[this.playerNumber].id)
    },

    playerStatus() {
      return this.battle.status[this.playerNumber]
    },

    opponentNumber() {
      return this.playerNumber === 1 ? 2 : 1
    },

    opponentPlayer() {
      return this.findPlayer(this.battle.players[this.opponentNumber].id)
    },

    opponentNFT() {
      return this.findNFT(this.battle.NFTs[this.opponentNumber].id)
    },

    opponentStatus() {
      return this.battle.status[this.opponentNumber]
    },

    isEnded() {
      return this.battle.state === BATTLE_STATE.ENDED
    },

    canMove() {
      return !this.isEnded && this.battle.current_move === this.playerNumber
    }
  },

  mounted() {
    this.starting = true

    setTimeout(() => {
      this.starting = false
    }, 5000)
  },

  methods: {
    attack() {
      this.$socket.emit('player:move', PLAYER_MOVE.ATTACK)
    }
  }
}
</script>
