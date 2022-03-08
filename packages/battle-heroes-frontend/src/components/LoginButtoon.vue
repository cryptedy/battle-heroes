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
  name: 'LoginButtoon',

  data() {
    return {
      loading: false,
      isMetaMaskEnabled: window.ethereum !== undefined
    }
  },

  methods: {
    ...mapActions({
      login: 'auth/login',
      setLoaded: 'app/setLoaded',
      setLoading: 'app/setLoading'
    }),

    async loginWithMetaMask() {
      try {
        this.loading = true

        await this.login()

        this.setLoading({ loading: false })
        this.setLoaded({ loaded: false })

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
