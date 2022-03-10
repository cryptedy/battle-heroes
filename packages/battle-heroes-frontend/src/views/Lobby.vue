<template>
  <LayoutMain>
    <p>
      <strong>{{ user.name }}</strong> -
      <router-link :to="{ name: 'logout' }"> Logout </router-link>
    </p>
    <img :src="user.image_url" width="32" height="32" />
    <p>Rank: Novice Hero</p>
    <p>User ID: {{ user.id }}</p>
    <p>Address: {{ user.address }}</p>

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
      <UserNFTs v-if="activeTab === 3" />
    </template>
  </LayoutMain>
</template>

<script>
import { mapGetters } from 'vuex'
import Chat from '@/components/Chat'
import Players from '@/components/Players'
import UserNFTs from '@/components/UserNFTs'
import LayoutMain from '@/components/LayoutMain'

export default {
  name: 'Lobby',

  components: {
    Chat,
    Players,
    UserNFTs,
    LayoutMain
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
      user: 'auth/user',
      player: 'game/player',
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
