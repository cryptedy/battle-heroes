<template>
  <p>{{ player.name }}</p>

  <router-link v-slot="{ href, navigate }" custom :to="{ name: 'logout' }">
    <BaseButton :href="href" @click="navigate"> LOGOUT </BaseButton>
  </router-link>

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
