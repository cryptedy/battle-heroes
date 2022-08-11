<template>
  <div class="battle-splash-screen">
    <div class="battle-splash-screen-content">
      <h1 class="battle-splash-screen-message">
        <BaseSpinner v-if="type === 'reload'" />
        {{ message }}
      </h1>

      <div v-if="type === 'challenger'" class="battle-splash-screen-challenger">
        <div class="nft">
          <div class="nft-image">
            <img
              src="@/assets/images/challenger.png"
              :alt="nft2.name"
              width="512"
              height="512"
            />
          </div>
        </div>
      </div>

      <div v-else class="battle-splash-screen-versus">
        <div class="battle-splash-screen-versus-primary">
          <div class="nft">
            <div class="nft-image">
              <img
                :src="nft1.image_url"
                :alt="nft1.name"
                width="512"
                height="512"
              />
            </div>
          </div>
        </div>

        <div class="battle-splash-screen-versus-symbol">VS</div>

        <div class="battle-splash-screen-versus-secondary">
          <div class="nft">
            <div class="nft-image">
              <img
                :src="nft2.image_url"
                :alt="nft2.name"
                width="512"
                height="512"
              />
            </div>
          </div>
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
  }
}
</script>
