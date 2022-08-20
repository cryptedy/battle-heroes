<template>
  <div class="battle">
    <div class="battle-status">
      <div class="battle-status-actions">
        <BaseButton v-if="canLeaveGame" type="primary" @click="leaveGame">
          <FontAwesomeIcon icon="arrow-left" />
        </BaseButton>

        <BaseButton v-else type="danger" @click="abortGame">
          <FontAwesomeIcon icon="arrow-left" />
        </BaseButton>
      </div>

      <div class="battle-status-primary">
        <p class="battle-status-current-turn">=== ターン {{ game.turn }} ===</p>

        <template v-if="aborted">
          <p style="font-weight: bold; color: #4caf50">YOU WINI!</p>
          <p>Opponent player aborted the battle.</p>
        </template>

        <template v-else-if="isGameFinished">
          <template v-if="playable">
            <p
              v-if="playerStatus.hp > opponentStatus.hp"
              style="font-weight: bold; color: #4caf50"
            >
              YOU WIN!
            </p>
            <p v-else style="font-weight: bold; color: #f44336">YOU LOSE...</p>
          </template>

          <template v-else>
            <p
              v-if="player1.hp > player2.hp"
              style="font-weight: bold; color: #4caf50"
            >
              {{ player1.name }} WIN!
            </p>
            <p v-else style="font-weight: bold; color: #4caf50">
              {{ player2.name }} WIN!
            </p>
          </template>

          <router-link
            :to="{ name: 'battles' }"
            style="font-weight: bold; color: #2196f3"
          >
            <FontAwesomeIcon icon="arrow-left" />
            戻る
          </router-link>
        </template>

        <template v-else>
          <p
            v-if="isOpponentPlayerOffline"
            style="color: rgba(255, 255, 255, 0.5)"
          >
            Opponent player is OFFLINE
          </p>

          <template v-if="playable">
            <p v-if="canMove" style="font-weight: bold; color: #2196f3">
              {{ player.name }} のターン
            </p>
            <p v-else style="color: rgba(255, 255, 255, 0.5)">
              {{ currentPlayer.name }} のターン
            </p>
          </template>

          <template v-else>
            <p style="color: rgba(255, 255, 255, 0.5)">
              {{ currentPlayer.name }} のターン.
            </p>
          </template>
        </template>
      </div>

      <div class="battle-status-actions">
        <ToggleAudio />
      </div>
    </div>

    <div class="battle-ground">
      <GamePlayer
        :player="opponentPlayer"
        :player-nft="opponentNFT"
        :player-status="opponentStatus"
        :opponent-player="player"
        :opponent-nft="playerNFT"
        :opponent-status="playerStatus"
        :current-player="currentPlayer"
        :finished="isGameFinished"
      />

      <GamePlayer
        :player="player"
        :player-nft="playerNFT"
        :player-status="playerStatus"
        :opponent-player="opponentPlayer"
        :opponent-nft="opponentNFT"
        :opponent-status="opponentStatus"
        :current-player="currentPlayer"
        :finished="isGameFinished"
      />
    </div>

    <div ref="messages" class="battle-messages">
      <ul>
        <li v-for="(message, index) in messages" :key="index">
          {{ message }}
        </li>
      </ul>
    </div>

    <div class="battle-controls">
      <template v-if="playable">
        <template v-if="isGameFinished">
          <button v-if="allowContinue" @click="onContinue">続けてバトル</button>

          <a
            class="twitter-share-button"
            :href="twitterLink"
            rel="nofollow"
            target="_blank"
            title="結果を Twitter でシェア"
          >
            <FontAwesomeIcon :icon="['fab', 'twitter']" />
            結果を Twitter でシェア
          </a>
        </template>

        <template v-else>
          <button
            :disabled="!canAttack"
            :class="{
              'is-disabled': !canAttack,
              'is-emphasis': playerStatus.mustCritical
            }"
            @click="attack"
          >
            攻撃 {{ playerStatus.attack_remains }}
          </button>
          <button :disabled="!canSpell" @click="spell">
            {{ $filters.spellLabel(playerNFT) }}
            {{ playerStatus.spell_remains }}
          </button>
          <button :disabled="!canDefence" @click="defence">防御</button>
          <button :disabled="!canHeal" @click="heal">
            回復 {{ playerStatus.heal_remains }}
          </button>
          <!-- <button :disabled="true">ヘルプ</button> -->
        </template>
      </template>

      <template v-else> WATCH MODE </template>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import GamePlayer from '@/components/GamePlayer'
import { scrollToBottom } from '@/utils/helpers'
import ToggleAudio from '@/components/ToggleAudio'

export default {
  name: 'Game',

  components: {
    GamePlayer,
    ToggleAudio
  },

  props: {
    game: {
      type: Object,
      required: true
    },

    messages: {
      type: Array,
      required: true
    },

    allowContinue: {
      type: Boolean,
      required: false,
      default: false
    },

    aborted: {
      type: Boolean,
      required: true
    },

    playable: {
      type: Boolean,
      required: false,
      default: false
    },

    player1: {
      type: Object,
      required: true
    },

    player2: {
      type: Object,
      required: true
    },

    nft1: {
      type: Object,
      required: true
    },

    nft2: {
      type: Object,
      required: true
    }
  },

  emits: ['attack', 'spell', 'defence', 'heal', 'abort', 'finish', 'continue'],

  data() {
    return {
      moving: false
    }
  },

  computed: {
    ...mapGetters({
      findNFT: 'NFT/find',
      gamePlayer: 'game/player',
      findPlayer: 'player/find'
    }),

    playerKey() {
      if (!this.gamePlayer) {
        return 1
      }

      if (this.player1.id === this.gamePlayer.id) {
        return 1
      } else if (this.player2.id === this.gamePlayer.id) {
        return 2
      }

      return 1
    },

    opponentPlayerKey() {
      return this.playerKey === 1 ? 2 : 1
    },

    player() {
      return this.playerKey === 1 ? this.player1 : this.player2
    },

    opponentPlayer() {
      return this.opponentPlayerKey === 1 ? this.player1 : this.player2
    },

    playerNFT() {
      return this.playerKey === 1 ? this.nft1 : this.nft2
    },

    opponentNFT() {
      return this.opponentPlayerKey === 1 ? this.nft1 : this.nft2
    },

    status() {
      return this.game.players
    },

    playerStatus() {
      return this.status[this.playerKey]
    },

    opponentStatus() {
      return this.status[this.opponentPlayerKey]
    },

    currentPlayerKey() {
      return this.game.current_player
    },

    currentPlayer() {
      return this.currentPlayerKey === 1 ? this.player1 : this.player2
    },

    isGameFinished() {
      return this.playerStatus.hp <= 0 || this.opponentStatus.hp <= 0
    },

    isOpponentPlayerOffline() {
      return !this.opponentPlayer.socket_ids.length > 0
    },

    canAttack() {
      return this.canMove && this.playerStatus.attack_remains > 0
    },

    canSpell() {
      return this.canMove && this.playerStatus.spell_remains > 0
    },

    canDefence() {
      return this.canMove
    },

    canHeal() {
      return (
        this.canMove &&
        this.playerStatus.hp < this.playerStatus.max_hp &&
        this.playerStatus.heal_remains > 0
      )
    },

    canLeaveGame() {
      return !this.playable || this.aborted || this.isGameFinished
    },

    canMove() {
      return (
        this.playable &&
        !this.aborted &&
        !this.isGameFinished &&
        !this.moving &&
        this.currentPlayerKey === this.playerKey
      )
    },

    twitterLink() {
      const isWin = this.playerStatus.hp > this.opponentStatus.hp

      const baseURL = 'http://twitter.com/intent/tweet'

      let text = ''
      text += '⚔️BATTLE HEROES⚔️\n'
      text += 'Pixel Heroes のバトルゲームで対戦したよ‼\n\n'
      text += '🔷気になる結果は・・・\n\n'
      text += isWin ? 'やったー！勝ち✌️\n\n' : '残念でした・・・負け😭\n\n'
      text += '⬇️自分のヒーローでバトルに挑もう\n'
      text += 'https://game.pixelheroes-dao.com/\n\n'
      text += '#PixelHeroes #BattleHeroes @pixelheroes_nft\n'
      text += `ID:${this.game.id}`

      const link = `${baseURL}?text=${encodeURIComponent(text)}`

      return link
    }
  },

  watch: {
    currentPlayerKey: {
      // eslint-disable-next-line no-unused-vars
      handler(value, oldValue) {
        this.onChangeTurn()
      }
    },

    messages: {
      // eslint-disable-next-line no-unused-vars
      handler(value, oldValue) {
        const smooth = oldValue !== undefined

        this.$nextTick(() => scrollToBottom(this.$refs.messages, smooth))
      },
      immediate: true,
      deep: true
    },

    isGameFinished: {
      // eslint-disable-next-line no-unused-vars
      handler(value, oldValue) {
        if (value & !oldValue) this.onGameFinished()
      },
      immediate: true
    }
  },

  created() {
    console.log('Game:created')
  },

  beforeUnmount() {
    console.log('Game:beforeUnmount')
  },

  methods: {
    onChangeTurn() {
      console.log('onChangeTurn')
      this.moving = false
    },

    attack() {
      console.log('Game:attack')

      if (!this.canAttack) return

      this.moving = true

      this.$emit('attack')
    },

    spell() {
      console.log('Game:spell')

      if (!this.canSpell) return

      this.moving = true

      this.$emit('spell')
    },

    defence() {
      console.log('Game:defence')

      if (!this.canDefence) return

      this.moving = true

      this.$emit('defence')
    },

    heal() {
      console.log('Game:heal')

      if (!this.canHeal) return

      this.moving = true

      this.$emit('heal')
    },

    leaveGame() {
      console.log('leaveGame')

      return this.$router.push(
        {
          name: 'battles',
          replace: true
        },
        () => {}
      )
    },

    abortGame() {
      console.log('abortGame')

      if (!this.canLeaveGame) {
        const answer = window.confirm('Abort the game?')

        if (!answer) return false
      }

      this.$emit('abort')
    },

    onGameFinished() {
      console.log('onGameFinished')

      this.$emit('finish')
    },

    onContinue() {
      console.log('onContinue')

      this.$emit('continue')
    }
  }
}
</script>
