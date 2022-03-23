<template>
  <TheLayoutGame>
    <h1>HOME</h1>

    <img
      v-for="playerNFT in playerNFTs"
      :key="playerNFT.id"
      :src="playerNFT.image_url"
      alt=""
      width="64"
      height="64"
    />

    <ul>
      <li>TODO: PLAYER STATS</li>
      <li>TODO: PLAYER RANKING</li>
      <li>TODO: PLAYERS LIST</li>
      <li>TODO: CURRENT BATTLES</li>
    </ul>
  </TheLayoutGame>
</template>

<script>
import { mapGetters } from 'vuex'
import TheLayoutGame from '@/components/TheLayoutGame'

export default {
  name: 'Home',

  components: {
    TheLayoutGame
  },

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
