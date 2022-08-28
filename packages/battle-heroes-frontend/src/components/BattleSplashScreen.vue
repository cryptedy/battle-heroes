<template>
  <teleport to="#teleport">
    <div class="battle-splash-screen">
      <div class="battle-splash-screen-content">
        <transition name="battle-splash-screen-message">
          <h1 v-show="showMessage" class="battle-splash-screen-message">
            <BaseSpinner v-if="type === BATTLE_SPLASH_SCREEN_TYPE.LOADING" />
            {{ message }}
          </h1>
        </transition>

        <div
          v-if="type === BATTLE_SPLASH_SCREEN_TYPE.RUSHING"
          class="battle-splash-screen-rushing"
        >
          <transition name="battle-splash-screen-nft">
            <div v-show="showNFTs" class="battle-splash-screen-nft">
              <div class="battle-splash-screen-nft-image">
                <img
                  src="@/assets/images/challenger.png"
                  alt="New challenger"
                  width="512"
                  height="512"
                />
              </div>
            </div>
          </transition>
        </div>

        <div v-else class="battle-splash-screen-matching">
          <div class="battle-splash-screen-matching-primary">
            <transition name="battle-splash-screen-nft">
              <div v-show="showNFTs" class="battle-splash-screen-nft">
                <NFTImage
                  :nft="playerNft"
                  class="battle-splash-screen-nft-image"
                />
              </div>
            </transition>
          </div>

          <div class="battle-splash-screen-matching-symbol">VS</div>

          <div class="battle-splash-screen-matching-secondary">
            <transition name="battle-splash-screen-nft">
              <div v-show="showNFTs" class="battle-splash-screen-nft">
                <NFTImage
                  :nft="opponentNft"
                  class="battle-splash-screen-nft-image"
                />
              </div>
            </transition>
          </div>
        </div>
      </div>
    </div>
  </teleport>
</template>

<script>
import NFTImage from '@/components/NFTImage'
import { BATTLE_SPLASH_SCREEN_TYPE } from '@/utils/constants'

export default {
  name: 'BattleSplashScreen',

  components: {
    NFTImage
  },

  props: {
    type: {
      type: String,
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

  data() {
    return {
      showMessage: false,
      showNFTs: false
    }
  },

  computed: {
    BATTLE_SPLASH_SCREEN_TYPE() {
      return BATTLE_SPLASH_SCREEN_TYPE
    },

    message() {
      if (this.type === BATTLE_SPLASH_SCREEN_TYPE.RUSHING) {
        return 'HERE COMES A NEW CHALLENGER!'
      }

      if (this.type === BATTLE_SPLASH_SCREEN_TYPE.LOADING) {
        return 'LOADING BATTLE...'
      }

      return 'BATTLE START!'
    }
  },

  mounted() {
    setTimeout(() => {
      this.showNFTs = true
    }, 500)

    setTimeout(() => {
      this.showMessage = true
    }, 800)
  }
}
</script>
