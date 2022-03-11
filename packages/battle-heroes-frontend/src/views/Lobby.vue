<template>
  <LayoutMain>
    <p>
      <strong>{{ player.name }}</strong> -
      <router-link :to="{ name: 'logout' }"> Logout </router-link>
    </p>
    <img :src="player.image_url" width="32" height="32" />
    <p>Level: {{ player.level }}</p>
    <p>Player ID: {{ player.id }}</p>
    <p>Address: {{ player.address }}</p>

    <hr />

    <p v-if="!connected">
      <BaseSpinner />
      Connecting to server...
    </p>

    <template v-else>
      <p>
        <a href="#" @click="changeTab(1)">
          <strong v-if="activeTab === 1"> PLAYERS </strong>
          <span v-else> PLAYERS </span>
        </a>
        -
        <a href="#" @click="changeTab(2)">
          <strong v-if="activeTab === 2"> CHAT </strong>
          <span v-else> CHAT </span>
        </a>
        -
        <a href="#" @click="changeTab(3)">
          <strong v-if="activeTab === 3"> HEROES </strong>
          <span v-else> HEROES </span>
        </a>
      </p>

      <Players v-if="activeTab === 1" />
      <Chat v-else-if="activeTab === 2" />
      <PlayerNFTs v-if="activeTab === 3" />
    </template>
  </LayoutMain>
</template>

<script>
import { mapGetters } from 'vuex'
import Chat from '@/components/Chat'
import Players from '@/components/Players'
import LayoutMain from '@/components/LayoutMain'
import PlayerNFTs from '@/components/PlayerNFTs'

export default {
  name: 'Lobby',

  components: {
    Chat,
    Players,
    LayoutMain,
    PlayerNFTs
  },

  data() {
    return {
      isMetaMaskEnabled: window.ethereum !== undefined,
      loading: false,
      activeTab: 1
    }
  },

  computed: {
    ...mapGetters({
      player: 'auth/player',
      connected: 'socket/connected'
    })
  },

  methods: {
    changeTab(tab) {
      this.activeTab = tab
    }
  }
}
</script>
