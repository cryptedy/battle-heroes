<template>
  <button v-if="!isMetaMaskEnabled" class="button is-diabled" disabled>
    Please install MetaMask
  </button>

  <button v-else class="button" :disabled="loading" @click="loginWithMetaMask">
    <BaseSpinner v-if="loading" />
    LOGIN
  </button>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'LoginButton',

  data() {
    return {
      loading: false,
      isMetaMaskEnabled: window.ethereum !== undefined
    }
  },

  methods: {
    ...mapActions({
      login: 'auth/login',
      setAppLoading: 'app/setLoading'
    }),

    async loginWithMetaMask() {
      try {
        this.loading = true

        await this.login()

        this.setAppLoading(true)

        this.$router.push(
          {
            name: 'players'
          },
          () => {}
        )
      } catch (error) {
        console.log(error)
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style lang="scss">
.button {
  height: 48px;
  margin: 16px 0;
  padding: 0 24px;
  border-radius: 3px;
  background-color: palette(blue, 500);
  color: palette(grey, 0);
  cursor: pointer;

  &.is-diabled {
    background-color: palette(grey, 500);
    color: palette(grey, 300);
  }
}
</style>
