<template>
  <BaseButton
    class="button login-button"
    :disabled="!isMetaMaskEnabled || loading"
    type="primary"
    @click="loginWithMetaMask"
  >
    <template v-if="!isMetaMaskEnabled"> Please install MetaMask </template>

    <template v-else>
      <BaseSpinner v-if="loading" />
      ログイン
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
            name: 'home'
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
              name: 'home'
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
