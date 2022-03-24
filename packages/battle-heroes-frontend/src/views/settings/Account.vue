<template>
  <h1>ACCOUNT</h1>

  <p>
    <router-link :to="{ name: 'logout' }" style="color: white">
      LOGOUT
    </router-link>
  </p>

  <p>name: {{ player.name }}</p>

  <ul style="display: flex; flex-wrap: wrap; gap: 2px; justify-content: center">
    <li v-for="playerNFT in playerNFTs" :key="playerNFT.id">
      <img :src="playerNFT.image_url" alt="" width="64" height="64" />
    </li>
  </ul>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'AccountSettings',

  computed: {
    ...mapGetters({
      player: 'game/player',
      NFTsByPlayer: 'NFT/byPlayer'
    }),

    playerNFTs() {
      return this.NFTsByPlayer(this.player)
    }
  }
}
</script>
