<template>
  <BaseButton v-if="!isMetaMaskEnabled" class="button is-diabled" disabled>
    Please install MetaMask
  </BaseButton>

  <BaseButton
    v-else
    class="button"
    :disabled="loading"
    @click="loginWithMetaMask"
  >
    <BaseSpinner v-if="loading" />
    LOGIN
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
