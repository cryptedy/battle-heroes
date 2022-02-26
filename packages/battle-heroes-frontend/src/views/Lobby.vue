<template>
  <p>
    <strong>{{ user.name }}</strong> -
    <RouterLink :to="{ name: 'logout' }"> Logout </RouterLink>
  </p>

  <img :src="user.image_url" width="32" height="32" />
  <p>Rank: Novice Hero</p>
  <p>User ID: {{ user.id }}</p>
  <p>Address: {{ user.address }}</p>

  <p>
    <a href="#" @click="changeTab(1)">
      <strong v-if="activeTab === 1"> Chat </strong>
      <span v-else> Chat </span>
      <span> ({{ unreadMessagesCount }}) </span>
    </a>
    |
    <a href="#" @click="changeTab(2)">
      <strong v-if="activeTab === 2"> Your NFTs </strong>
      <span v-else> Your NFTs </span>
    </a>
  </p>

  <hr />

  <div>
    <KeepAlive>
      <Chat v-if="activeTab === 1" @message="onMessage" />

      <UserNFTs v-else-if="activeTab === 2" />
    </KeepAlive>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Chat from '@/components/Chat'
import UserNFTs from '@/components/UserNFTs'

export default {
  name: 'Lobby',

  components: {
    Chat,
    UserNFTs
  },

  data() {
    return {
      isMetaMaskEnabled: window.ethereum !== undefined,
      loading: false,
      activeTab: 1,
      unreadMessagesCount: 0
    }
  },

  computed: {
    ...mapGetters({
      user: 'auth/user'
    })
  },

  watch: {
    // eslint-disable-next-line no-unused-vars
    activeTab(value, oldValue) {
      if (value === 1) {
        this.unreadMessagesCount = 0
      }
    }
  },

  methods: {
    changeTab(tab) {
      this.activeTab = tab
    },

    onMessage() {
      if (this.activeTab !== 1) {
        this.unreadMessagesCount++
      }
    }
  }
}
</script>
