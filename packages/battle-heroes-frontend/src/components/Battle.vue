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
          <p>対戦相手がゲームを中止しました</p>
        </template>

        <template v-else-if="isGameOver">
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
              v-if="playerStatus.hp > opponentStatus.hp"
              style="font-weight: bold; color: #4caf50"
            >
              {{ player.name }} WIN!
            </p>
            <p v-else style="font-weight: bold; color: #4caf50">
              {{ opponentPlayer.name }} WIN!
            </p>
          </template>

          <router-link
            :to="{ name: 'arena' }"
            style="font-weight: bold; color: #2196f3"
          >
            <FontAwesomeIcon icon="arrow-left" />
            戻る
          </router-link>
        </template>

        <template v-else>
          <p v-if="cpuBattle" style="color: #ffeb3b">CPU バトル中</p>

          <template v-if="playable">
            <p v-if="canMove" style="font-weight: bold; color: #2196f3">
              {{ player.name }} のターン
            </p>
            <p v-else style="color: rgba(255, 255, 255, 0.5)">
              {{ currentPlayer.name }} のターン
            </p>
          </template>

          <template v-else>
            <p
              v-if="isCurrentPlayerOnline"
              style="font-weight: bold; color: #2196f3"
            >
              {{ currentPlayer.name }} のターン
            </p>
            <p v-else style="color: rgba(255, 255, 255, 0.5)">
              {{ currentPlayer.name }} のターン
            </p>
          </template>
        </template>
      </div>

      <div class="battle-status-actions">
        <ToggleAudio />
      </div>
    </div>

    <div class="battle-ground">
      <BattlePlayer
        :player="opponentPlayer"
        :player-nft="opponentNft"
        :player-status="opponentStatus"
        :player-online="isOpponentPlayerOnline"
        :opponent-player="player"
        :opponent-nft="playerNft"
        :opponent-status="playerStatus"
        :opponent-online="isPlayerOnline"
        :current-player="currentPlayer"
        :finished="isGameOver"
      />

      <BattlePlayer
        :player="player"
        :player-nft="playerNft"
        :player-status="playerStatus"
        :player-online="isPlayerOnline"
        :opponent-player="opponentPlayer"
        :opponent-nft="opponentNft"
        :opponent-status="opponentStatus"
        :opponent-online="isOpponentPlayerOnline"
        :current-player="currentPlayer"
        :finished="isGameOver"
      />
    </div>

    <div ref="messages" class="battle-messages">
      <p
        v-for="(line, lineIndex) in messages"
        :key="lineIndex"
        :style="line.style"
        :class="line.class"
      >
        <span
          v-for="(word, wordIndex) in line.words"
          :key="`${lineIndex}-${wordIndex}`"
          :style="word.style"
          :class="word.class"
        >
          {{ word.text }}
        </span>
      </p>
    </div>

    <div class="battle-controls">
      <template v-if="playable">
        <template v-if="isGameOver">
          <template v-if="!canNextBattle">
            <BaseButton type="primary" :disabled="true">
              続けてバトル
            </BaseButton>

            <a class="button twitter-share-button is-disabled">
              <FontAwesomeIcon :icon="['fab', 'twitter']" />
              結果を Twitterでシェア
            </a>
          </template>

          <template v-else>
            <BattleCreateButton label="続けてバトル" />

            <a
              class="button twitter-share-button"
              :href="twitterLink"
              rel="nofollow"
              target="_blank"
              title="結果を Twitter でシェア"
            >
              <FontAwesomeIcon :icon="['fab', 'twitter']" />
              結果を Twitter でシェア
            </a>
          </template>
        </template>

        <template v-else>
          <BaseButton
            type="primary"
            :disabled="!canAttack"
            :class="{
              'is-disabled': !canAttack,
              'is-type-golden': playerStatus.must_critical
            }"
            @click="attack"
          >
            攻撃 {{ playerStatus.attack_remains }}
          </BaseButton>
          <BaseButton type="primary" :disabled="!canSpell" @click="spell">
            {{ $filters.spellLabel(playerNft) }}
            {{ playerStatus.spell_remains }}
          </BaseButton>
          <BaseButton type="primary" :disabled="!canDefence" @click="defence"
            >防御</BaseButton
          >
          <BaseButton type="primary" :disabled="!canHeal" @click="heal">
            回復 {{ playerStatus.heal_remains }}
          </BaseButton>
        </template>
      </template>

      <template v-else>
        <BaseButton v-if="canLeaveGame" type="primary" @click="leaveGame">
          <FontAwesomeIcon icon="arrow-left" />
          戻る
        </BaseButton>

        <BattleRushButton :battle="battle" />
      </template>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { PLAYER_STATE } from '@/utils/constants'
import { scrollToBottom } from '@/utils/helpers'
import ToggleAudio from '@/components/ToggleAudio'
import BattlePlayer from '@/components/BattlePlayer'
import BattleRushButton from '@/components/BattleRushButton'
import BattleCreateButton from '@/components/BattleCreateButton'

export default {
  name: 'Battle',

  components: {
    ToggleAudio,
    BattlePlayer,
    BattleRushButton,
    BattleCreateButton
  },

  props: {
    battle: {
      type: Object,
      required: true
    },

    game: {
      type: Object,
      required: true
    },

    messages: {
      type: Array,
      required: true
    },

    cpuBattle: {
      type: Boolean,
      required: true
    },

    playable: {
      type: Boolean,
      required: false,
      default: false
    },

    spectate: {
      type: Boolean,
      required: false,
      default: false
    },

    aborted: {
      type: Boolean,
      required: true
    },

    finished: {
      type: Boolean,
      required: true
    },

    playerKey: {
      type: Number,
      required: true
    },

    opponentPlayerKey: {
      type: Number,
      required: true
    },

    player: {
      type: Object,
      required: true
    },

    opponentPlayer: {
      type: Object,
      required: true
    },

    playerNft: {
      type: Object,
      required: true
    },

    opponentNft: {
      type: Object,
      required: true
    }
  },

  emits: [
    'attack',
    'spell',
    'defence',
    'heal',
    'move-cpu',
    'leave',
    'abort',
    'finish',
    'online-status'
  ],

  data() {
    return {
      moving: false,
      canNextBattle: false
    }
  },

  computed: {
    ...mapGetters({
      gamePlayer: 'game/player',
      playerBattle: 'game/playerBattle'
    }),

    players() {
      return this.game.players
    },

    status() {
      return this.players
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
      return this.currentPlayerKey === this.playerKey
        ? this.player
        : this.opponentPlayer
    },

    isPlayerOnline() {
      return this.player.socket_ids.length > 0
    },

    isOpponentPlayerOnline() {
      return this.opponentPlayer.socket_ids.length > 0
    },

    isCurrentPlayerOnline() {
      return this.currentPlayerKey === this.playerKey
        ? this.isPlayerOnline
        : this.isOpponentPlayerOnline
    },

    isPlayerBattle() {
      return this.playerBattle && this.playerBattle.id === this.battle.id
    },

    isGameOver() {
      return this.playerStatus.hp <= 0 || this.opponentStatus.hp <= 0
    },

    canStartBattle() {
      return !this.playerBattle && this.gamePlayer.state === PLAYER_STATE.IDLE
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
      return !this.playable || this.aborted || this.isGameOver
    },

    canMove() {
      return (
        this.playable &&
        !this.aborted &&
        !this.moving &&
        !this.isGameOver &&
        this.currentPlayerKey === this.playerKey
      )
    },

    canMoveCPU() {
      return (
        this.cpuBattle &&
        this.playable &&
        !this.aborted &&
        !this.moving &&
        !this.isGameOver &&
        this.currentPlayerKey !== this.playerKey
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
      },
      immediate: true
    },

    isPlayerOnline: {
      handler(value, oldValue) {
        if (value === undefined) return
        if (oldValue === undefined) return
        if (value !== oldValue) {
          this.$emit('online-status', this.player, value)
        }
      },
      immediate: true
    },

    isOpponentPlayerOnline: {
      handler(value, oldValue) {
        if (value === undefined) return
        if (oldValue === undefined) return
        if (value !== oldValue) {
          this.$emit('online-status', this.opponentPlayer, value)
        }
      },
      immediate: true
    },

    isGameOver: {
      // eslint-disable-next-line no-unused-vars
      handler(value, oldValue) {
        if (value & !oldValue) this.finishGame()
      },
      immediate: true
    },

    messages: {
      // eslint-disable-next-line no-unused-vars
      handler(value, oldValue) {
        const smooth = oldValue !== undefined

        this.$nextTick(() => scrollToBottom(this.$refs.messages, smooth))
      },
      immediate: true,
      deep: true
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

      if (
        this.cpuBattle &&
        this.currentPlayerKey !== this.playerKey &&
        !this.isGameOver
      ) {
        setTimeout(() => {
          this.moveCPU()
        }, 1200)
      }
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

    moveCPU() {
      console.log('Game:moveCPU')

      if (!this.canMoveCPU) return

      this.moving = true

      this.$emit('move-cpu')
    },

    leaveGame() {
      console.log('leaveGame')

      this.$emit('leave')
    },

    abortGame() {
      console.log('abortGame')

      this.$emit('abort')
    },

    finishGame() {
      console.log('finishGame')

      // differentiate between players fro better matching
      const wait = this.playerKey === 1 ? 1000 : 3000

      setTimeout(() => {
        this.canNextBattle = true
      }, wait)

      this.$emit('finish')
    }
  }
}
</script>
