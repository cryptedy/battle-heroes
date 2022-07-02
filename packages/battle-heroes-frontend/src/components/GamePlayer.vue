<template>
  <div
    class="battle-ground-player"
    :class="{
      'is-current-turn': isPlayerTurn,
      'is-win': isWin,
      'is-lose': isLose,
      shake: damageTaking
    }"
  >
    <div
      class="battle-ground-player-name player-name"
      :class="{
        'is-online': isPlayerOnline,
        'is-win': isWin,
        'is-lose': isLose
      }"
    >
      {{ player.name }}
    </div>

    <div class="battle-ground-nft">
      <div
        class="battle-ground-nft-name"
        :class="{
          'is-current-turn': isPlayerTurn,
          'is-win': isWin,
          'is-lose': isLose
        }"
      >
        <p>{{ playerNft.name }}</p>
      </div>

      <div
        class="battle-ground-nft-image"
        :class="{
          'is-win': isWin,
          'is-lose': isLose
        }"
      >
        <img
          :src="playerNft.image_url"
          :alt="playerNft.name"
          width="512"
          height="512"
        />
      </div>

      <HealthBar :max-hp="playerStatus.max_hp" :hp="playerStatus.hp" />

      <div
        class="battle-ground-nft-status"
        :class="{
          'is-win': isWin,
          'is-lose': isLose
        }"
      >
        <dl class="battle-ground-nft-status-list">
          <dt class="battle-ground-nft-status-list-title">HP</dt>
          <dd class="battle-ground-nft-status-list-data">
            {{ playerStatus.hp }} / {{ playerStatus.max_hp }}
            <span
              v-if="playerStatus.max_hp > opponentStatus.max_hp"
              class="has-advantage"
            >
              <FontAwesomeIcon icon="star" />
            </span>
          </dd>
          <dt class="battle-ground-nft-status-list-title">ATK</dt>
          <dd class="battle-ground-nft-status-list-data">
            {{ playerStatus.attack }}
            <span
              v-if="playerStatus.attack > opponentStatus.attack"
              class="has-advantage"
            >
              <FontAwesomeIcon icon="star" />
            </span>
          </dd>
          <dt class="battle-ground-nft-status-list-title">DEF</dt>
          <dd class="battle-ground-nft-status-list-data">
            {{ playerStatus.defense }}
            <span
              v-if="playerStatus.defense > opponentStatus.defense"
              class="has-advantage"
            >
              <FontAwesomeIcon icon="star" />
            </span>
          </dd>
          <dt class="battle-ground-nft-status-list-title">SPD</dt>
          <dd class="battle-ground-nft-status-list-data">
            {{ playerStatus.speed }}
            <span
              v-if="playerStatus.speed > opponentStatus.speed"
              class="has-advantage"
            >
              <FontAwesomeIcon icon="star" />
            </span>
          </dd>
          <dt class="battle-ground-nft-status-list-title">種族</dt>
          <dd class="battle-ground-nft-status-list-data">
            {{ body(playerNft.attributes) }}
          </dd>
        </dl>
      </div>

      <!-- <div class="battle-ground-nft-attributes">
        <ul>
          <li
            v-for="attribute in playerNft.attributes"
            :key="attribute.trait_type"
          >
            {{ attribute.trait_type }} =>
            {{ attribute.value }}
          </li>
        </ul>
      </div> -->
    </div>
  </div>
</template>

<script>
import HealthBar from '@/components/HealthBar'

export default {
  name: 'GamePlayer',

  components: {
    HealthBar
  },

  props: {
    player: {
      type: Object,
      required: true
    },

    playerNft: {
      type: Object,
      required: true
    },

    playerStatus: {
      type: Object,
      required: true
    },

    opponentPlayer: {
      type: Object,
      required: true
    },

    opponentNft: {
      type: Object,
      required: true
    },

    opponentStatus: {
      type: Object,
      required: true
    },

    currentPlayer: {
      type: Object,
      required: true
    },

    finished: {
      type: Boolean,
      required: false
    }
  },

  data() {
    return {
      damageTaking: false
    }
  },

  computed: {
    playerHp() {
      return this.playerStatus.hp
    },

    isPlayerTurn() {
      return this.currentPlayer.id === this.player.id
    },

    isPlayerOnline() {
      return this.player.socket_ids.length > 0
    },

    isWin() {
      return this.finished && this.playerStatus.hp > this.opponentStatus.hp
    },

    isLose() {
      return this.finished && this.playerStatus.hp < this.opponentStatus.hp
    },

    body() {
      return attributes =>
        attributes.find(attribute => attribute.trait_type === 'body').value
    }
  },

  watch: {
    playerHp(value, oldValue) {
      console.log('watch:playerHp', value, oldValue)

      if (value < oldValue) {
        this.damageTaking = true

        setTimeout(() => {
          this.damageTaking = false
        }, 400)
      }
    }
  }
}
</script>
