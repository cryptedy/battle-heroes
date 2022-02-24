<template>
  <p v-if="!isMetaMaskEnabled">Please install MetaMask</p>

  <p v-else-if="loading">
    <Spinner />
    Login...
  </p>

  <button v-else @click="loginWithMetaMask">
    {{ $t('message.login') }}
  </button>
</template>

<script>
import { mapActions } from 'vuex'
import Spinner from '@/components/Spinner'

export default {
  name: 'LoginButtoon',

  components: {
    Spinner
  },

  data() {
    return {
      loading: false,
      isMetaMaskEnabled: window.ethereum !== undefined
    }
  },

  methods: {
    ...mapActions({
      login: 'auth/login',
      getNFTs: 'NFT/getNFTs',
      getUserNFTTokenIds: 'auth/getUserNFTTokenIds'
    }),

    async loginWithMetaMask() {
      try {
        this.loading = true

        await this.login()
        await this.getNFTs()
        await this.getUserNFTTokenIds()

        this.$router.push(
          {
            name: 'lobbies'
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
