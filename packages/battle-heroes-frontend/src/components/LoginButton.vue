<template>
  <BaseButton
    class="login-button"
    :disabled="!isMetaMaskEnabled || loading"
    type="primary"
    @click="loginWithMetaMask"
  >
    <template v-if="!isMetaMaskEnabled"> Please install MetaMask </template>

    <template v-else>
      <BaseSpinner v-if="loading" />
      ウォレットを接続
    </template>
  </BaseButton>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'LoginButton',

  data() {
    return {
      loading: false,
      isMetaMaskEnabled: window.ethereum !== undefined
    }
  },

  computed: {
    ...mapGetters({
      isLogin: 'auth/isLogin'
    })
  },

  methods: {
    ...mapActions({
      login: 'auth/login',
      setAppLoading: 'app/setLoading'
    }),

    async loginWithMetaMask() {
      if (this.isLogin) {
        this.$router.push(
          {
            name: 'arena'
          },
          () => {}
        )
      } else {
        try {
          this.loading = true

          await this.login()

          this.setAppLoading(true)

          this.$router.push(
            {
              name: 'arena'
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
}
</script>
