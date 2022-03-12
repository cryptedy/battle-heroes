<template>
  <p v-if="!isMetaMaskEnabled">Please install MetaMask</p>

  <button v-else :disabled="loading" @click="loginWithMetaMask">
    <BaseSpinner v-if="loading" />
    {{ $t('message.login') }}
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
            name: 'lobby'
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
