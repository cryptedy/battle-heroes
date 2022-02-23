<template>
  <Header />

  <h2>Lobbies</h2>

  <p>{{ user.name }}</p>
  <p><img :src="user.image_url" /></p>
  <p>User ID: {{ user.id }}</p>
  <p>Address: {{ user.address }}</p>
  <p>
    <router-link :to="{ name: 'logout' }"> Logout </router-link>
  </p>

  <ul>
    <li v-for="userPixelHero in userPixelHeroes" :key="userPixelHero.token_id">
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
</template>

<script>
import { mapGetters } from 'vuex'
import Header from '@/components/Header'
import { COLLECTION } from '@/utils/constants'

export default {
  name: 'Lobbies',

  components: {
    Header
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
      userNFTs: 'NFT/userNFTs'
    }),

    userPixelHeroes() {
      return this.userNFTs(COLLECTION.PIXEL_HEROES)
    },

    userPixelHeroesX() {
      return this.userNFTs(COLLECTION.PIXEL_HEROES_X)
    }
  }
}
</script>
