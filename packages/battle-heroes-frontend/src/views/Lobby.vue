<template>
  <p>
    <strong>{{ user.name }}</strong> -
    <RouterLink :to="{ name: 'logout' }"> Logout </RouterLink>
  </p>
  <img :src="user.image_url" width="32" height="32" />
  <BaseAccordion>
    <template #trigger="scopeProps">
      <a href="#">
        <span v-if="scopeProps.show"> ▼ </span>
        <span v-else> ▶ </span>
        My Heroes
      </a>
    </template>
    <template #contents>
      <UserNFTs />
    </template>
  </BaseAccordion>
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
      <a href="#" @click="changeTab(2)">
        <strong v-if="activeTab === 2"> CHAT </strong>
        <span v-else> CHAT </span>
      </a>
    </p>

    <Players v-if="activeTab === 1" />
    <Chat v-else-if="activeTab === 2" />
  </template>
</template>

<script>
import { mapGetters } from 'vuex'
import Chat from '@/components/Chat'
import Players from '@/components/Players'
import UserNFTs from '@/components/UserNFTs'

export default {
  name: 'Lobby',

  components: {
    Chat,
    Players,
    UserNFTs
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
      connected: 'socket/connected'
    })
  },

  mounted() {
    this.$socket.connect()
    this.$socket.on('connect', () => this.$socket.emit('chat:join', this.user))
  },

  beforeUnmount() {
    this.$socket.off('connect')
  },

  methods: {
    changeTab(tab) {
      this.activeTab = tab
    }
  }
}
</script>
