<template>
  <div v-if="!check">
    <p v-if="loading">
      <Spinner />
      Connect your wallet...
    </p>

    <p v-else-if="!isMetaMaskEnabled">Please install MetaMask</p>

    <button v-else @click="connectWallet">Connect Wallet</button>
  </div>

  <div v-else>
    <p>{{ user.name }}</p>
    <p><img :src="user.image_url" /></p>
    <p>User ID: {{ user.id }}</p>
    <p>Address: {{ user.address }}</p>
    <p>
      <button @click="disconnectWallet">Logout</button>
    </p>
  </div>

  <div v-if="check">
    <p v-if="loading">
      <Spinner />
      Fetch your NFTs...
    </p>

    <div v-else>
      <ul>
        <li
          v-for="userPixelHero in userPixelHeroes"
          :key="userPixelHero.token_id"
        >
          <p>
            <strong>#{{ userPixelHero.token_id }}</strong>
          </p>
          <img
            :src="userPixelHero.image_url"
            :alt="userPixelHero.name"
            width="64"
            height="64"
          />
          <ul>
            <li
              v-for="attribute in userPixelHero.attributes"
              :key="attribute.trait_type"
            >
              {{ attribute.trait_type }}: {{ attribute.value }}
            </li>
          </ul>
          <hr />
        </li>
      </ul>

      <ul>
        <li
          v-for="userPixelHeroX in userPixelHeroesX"
          :key="userPixelHeroX.token_id"
        >
          <p>
            <strong>#{{ userPixelHeroX.token_id }}</strong>
          </p>
          <img
            :src="userPixelHeroX.image_url"
            :alt="userPixelHeroX.name"
            width="64"
            height="64"
          />
          <ul>
            <li
              v-for="attributeX in userPixelHeroX.attributes"
              :key="attributeX.trait_type"
            >
              {{ attributeX.trait_type }}: {{ attributeX.value }}
            </li>
          </ul>
          <hr />
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import Spinner from '@/components/Spinner'
import { mapGetters, mapActions } from 'vuex'
import { COLLECTION } from '@/utils/constants'

export default {
  name: 'Home',

  components: {
    Spinner
  },

  data() {
    return {
      isMetaMaskEnabled: window.ethereum !== undefined,
      loading: false
    }
  },

  computed: {
    ...mapGetters({
      user: 'auth/user',
      check: 'auth/check',
      userNFTs: 'NFT/userNFTs'
    }),

    userPixelHeroes() {
      return this.userNFTs(COLLECTION.PIXEL_HEROES)
    },

    userPixelHeroesX() {
      return this.userNFTs(COLLECTION.PIXEL_HEROES_X)
    }
  },

  methods: {
    ...mapActions({
      login: 'auth/login',
      logout: 'auth/logout',
      getUserNFTTokenIds: 'auth/getUserNFTTokenIds'
    }),

    async connectWallet() {
      try {
        this.loading = true
        await this.login()
        await this.getUserNFTTokenIds()
      } catch (error) {
        console.log(error)
      } finally {
        this.loading = false
      }
    },

    async disconnectWallet() {
      try {
        await this.logout()
      } catch (error) {
        console.log(error)
      }
    }
  }
}
</script>
