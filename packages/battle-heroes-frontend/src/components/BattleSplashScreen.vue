<template>
  <div class="battle-splash-screen">
    <div class="battle-splash-screen-content">
      <transition name="battle-splash-screen-message">
        <h1 v-if="showMessage" class="battle-splash-screen-message">
          <BaseSpinner v-if="type === 'reload'" />
          {{ message }}
        </h1>
      </transition>

      <div v-if="type === 'challenger'" class="battle-splash-screen-challenger">
        <transition name="battle-splash-screen-nft">
          <div v-if="showNFTs" class="battle-splash-screen-nft">
            <div class="battle-splash-screen-nft-image">
              <img
                src="@/assets/images/challenger.png"
                :alt="nft2.name"
                width="512"
                height="512"
              />
            </div>
          </div>
        </transition>
      </div>

      <div v-else class="battle-splash-screen-versus">
        <div class="battle-splash-screen-versus-primary">
          <transition name="battle-splash-screen-nft">
            <div v-if="showNFTs" class="battle-splash-screen-nft">
              <div class="battle-splash-screen-nft-image">
                <img
                  :src="nft1.image_url"
                  :alt="nft1.name"
                  width="512"
                  height="512"
                />
              </div>
            </div>
          </transition>
        </div>

        <div v-if="showMessage" class="battle-splash-screen-versus-symbol">
          VS
        </div>

        <div class="battle-splash-screen-versus-secondary">
          <transition name="battle-splash-screen-nft">
            <div v-if="showNFTs" class="battle-splash-screen-nft">
              <div class="battle-splash-screen-nft-image">
                <img
                  :src="nft2.image_url"
                  :alt="nft2.name"
                  width="512"
                  height="512"
                />
              </div>
            </div>
          </transition>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BattleSplashScreen',

  props: {
    type: {
      type: String,
      required: true
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

  data() {
    return {
      showMessage: false,
      showNFTs: false
    }
  },

  computed: {
    message() {
      if (this.type === 'challenger') {
        return 'HERE COMES A NEW CHALLENGER!'
      }

      if (this.type === 'reload') {
        return 'BATTLE LOADING...'
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
