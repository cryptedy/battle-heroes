<template>
  <div
    class="battle-ground-player"
    :class="{
      'is-current-turn': isPlayerTurn,
      'is-win': isWin,
      'is-lose': isLose,
      shake: damageTaking
    }"
    @click="toggleNFTInfoType"
  >
    <div
      class="battle-ground-player-name"
      :class="{
        'is-cpu': isPlayerCPU,
        'is-online': playerOnline,
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
        {{ $filters.NFTShortName(playerNft) }}
        <Stars :stars="playerNft.stars" />
      </div>

      <div class="battle-ground-nft-content">
        <div class="battle-ground-nft-content-primary">
          <NFTImage
            :nft="playerNft"
            class="battle-ground-nft-image"
            :class="{
              'is-win': isWin,
              'is-lose': isLose
            }"
          />

          <HealthBar :max-hp="playerStatus.max_hp" :hp="playerStatus.hp" />

          <div class="battle-ground-nft-info">
            <transition :name="NFTInfoTransitionName" mode="out-in">
              <div
                v-if="activeNFTInfoType === NFTInfoTypes.STATUS"
                class="battle-ground-nft-status"
                :class="{
                  'is-win': isWin,
                  'is-lose': isLose
                }"
              >
                <dl class="battle-ground-nft-status-list">
                  <dt class="battle-ground-nft-status-list-title">HP</dt>
                  <dd class="battle-ground-nft-status-list-data">
                    <span>
                      {{ playerStatus.hp }} / {{ playerStatus.max_hp }}
                    </span>
                    <span
                      v-if="playerStatus.max_hp > opponentStatus.max_hp"
                      class="has-advantage"
                    >
                      <FontAwesomeIcon icon="diamond" />
                    </span>
                  </dd>
                  <dt class="battle-ground-nft-status-list-title">ATK</dt>
                  <dd class="battle-ground-nft-status-list-data">
                    <span>{{ playerStatus.attack }}</span>
                    <span
                      v-if="playerStatus.attack > opponentStatus.attack"
                      class="has-advantage"
                    >
                      <FontAwesomeIcon icon="diamond" />
                    </span>
                  </dd>
                  <dt class="battle-ground-nft-status-list-title">DEF</dt>
                  <dd class="battle-ground-nft-status-list-data">
                    <span>{{ playerStatus.defense }}</span>
                    <span
                      v-if="playerStatus.defense > opponentStatus.defense"
                      class="has-advantage"
                    >
                      <FontAwesomeIcon icon="diamond" />
                    </span>
                  </dd>
                  <dt class="battle-ground-nft-status-list-title">INT</dt>
                  <dd class="battle-ground-nft-status-list-data">
                    <span>{{ playerStatus.int }}</span>
                    <span
                      v-if="playerStatus.int > opponentStatus.int"
                      class="has-advantage"
                    >
                      <FontAwesomeIcon icon="diamond" />
                    </span>
                  </dd>
                  <dt class="battle-ground-nft-status-list-title">SPD</dt>
                  <dd class="battle-ground-nft-status-list-data">
                    <span>{{ playerStatus.speed }}</span>
                    <span
                      v-if="playerStatus.speed > opponentStatus.speed"
                      class="has-advantage"
                    >
                      <FontAwesomeIcon icon="diamond" />
                    </span>
                  </dd>
                  <dt class="battle-ground-nft-status-list-title">種族</dt>
                  <dd class="battle-ground-nft-status-list-data">
                    <span>{{ body(playerNft.attributes) }}</span>
                  </dd>
                </dl>
              </div>

              <div v-else class="battle-ground-nft-meta">
                <div class="battle-ground-nft-rarity">
                  <BaseNFTRarity :nft="playerNft" />
                </div>

                <div class="battle-ground-nft-attributes">
                  <BaseNFTAttributes :nft="playerNft" />
                </div>
              </div>
            </transition>
          </div>
        </div>

        <div class="battle-ground-nft-content-secondary">
          <div class="battle-ground-nft-rarity">
            <p>レアリティ</p>
            <BaseNFTRarity :nft="playerNft" />
          </div>

          <div class="battle-ground-nft-attributes">
            <p>プロパティ</p>
            <BaseNFTAttributes :nft="playerNft" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Stars from '@/components/Stars'
import NFTImage from '@/components/NFTImage'
import { mapGetters, mapActions } from 'vuex'
import HealthBar from '@/components/HealthBar'
import BaseNFTRarity from '@/components/BaseNFTRarity'
import { PLAYER_TYPE, SOUND_EFFECT } from '@/utils/constants'
import BaseNFTAttributes from '@/components/BaseNFTAttributes'

const NFT_INFO_TYPE = Object.freeze({
  STATUS: 1,
  META: 2
})

export default {
  name: 'BattlePlayer',

  components: {
    Stars,
    NFTImage,
    HealthBar,
    BaseNFTRarity,
    BaseNFTAttributes
  },

  props: {
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
    },

    playerStatus: {
      type: Object,
      required: true
    },

    opponentStatus: {
      type: Object,
      required: true
    },

    playerOnline: {
      type: Boolean,
      required: true
    },

    opponentOnline: {
      type: Boolean,
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
      damageTaking: false,
      activeNFTInfoType: NFT_INFO_TYPE.STATUS
    }
  },

  computed: {
    ...mapGetters({
      windowWidth: 'window/width'
    }),

    playerHp() {
      return this.playerStatus.hp
    },

    isPlayerTurn() {
      return this.currentPlayer.id === this.player.id
    },

    isPlayerCPU() {
      return this.player.type === PLAYER_TYPE.CPU
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
    },

    NFTInfoTypes() {
      return NFT_INFO_TYPE
    },

    NFTInfoTransitionName() {
      const direction =
        this.activeNFTInfoType === NFT_INFO_TYPE.STATUS ? 'left' : 'right'

      return `battle-ground-nft-info-slide-${direction}`
    }
  },

  watch: {
    windowWidth: {
      // eslint-disable-next-line no-unused-vars
      handler(value, oldValue) {
        if (value >= 768) {
          this.activeNFTInfoType = NFT_INFO_TYPE.STATUS
        }
      },
      immediate: true
    },

    playerHp(value, oldValue) {
      console.log('watch:playerHp', value, oldValue)

      if (value < oldValue) {
        this.damageTaking = true

        this.playAudio(SOUND_EFFECT.DAMAGE).then(() => {
          setTimeout(() => {
            this.damageTaking = false
          }, 400)
        })
      }
    }
  },

  methods: {
    ...mapActions({
      playAudio: 'audio/play'
    }),

    toggleNFTInfoType() {
      if (this.windowWidth >= 768) {
        this.activeNFTInfoType = NFT_INFO_TYPE.STATUS
        return
      }

      this.activeNFTInfoType =
        this.activeNFTInfoType === NFT_INFO_TYPE.STATUS
          ? NFT_INFO_TYPE.META
          : NFT_INFO_TYPE.STATUS
    }
  }
}
</script>
