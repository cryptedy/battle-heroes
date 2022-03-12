<template>
  <LayoutMain>
    <p v-if="!isGameLogin">
      <BaseSpinner />
      Connecting to gmae server...
    </p>

    <template v-else>
      <p>
        <strong>{{ player.name }}</strong> -
        <router-link :to="{ name: 'logout' }"> Logout </router-link>
      </p>

      <BasePlayerAvatar :player="player" />

      <p>Level: {{ player.level }}</p>
      <p>Player ID: {{ player.id }}</p>
      <p>Address: {{ player.address }}</p>
      <p>state: {{ $filters.playerState(player.state) }}</p>

      <hr />

      <button
        v-if="player.state === PLAYER_STATE.IDLE"
        @click="changeState(PLAYER_STATE.STANDBY)"
      >
        STAND-BY
      </button>
      <button
        v-if="player.state === PLAYER_STATE.STANDBY"
        @click="changeState(PLAYER_STATE.IDLE)"
      >
        IDLE
      </button>

      <hr />

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
import Chat from '@/components/Chat'
import Players from '@/components/Players'
import { mapGetters, mapActions } from 'vuex'
import LayoutMain from '@/components/LayoutMain'
import PlayerNFTs from '@/components/PlayerNFTs'
import { PLAYER_STATE } from '@/utils/constants'

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
      activeTab: 1,
      PLAYER_STATE: PLAYER_STATE
    }
  },

  computed: {
    ...mapGetters({
      isGameLogin: 'game/isLogin',
      player: 'player/userPlayer'
    })
  },

  async created() {
    if (!this.isGameLogin) {
      try {
        await this.loginGame()
      } catch (error) {
        console.log(error)
      }
    }
  },

  mounted() {
    console.log('Lobby mounted')

    this.$socket.on('disconnect', () => this.onDisconnect())
    this.$socket.on('player:players', players => this.setPlayers(players))
    this.$socket.on('chat:messages', messages => this.setMessages(messages))
    this.$socket.on('chat:message', message => this.addMessage(message))
    this.$socket.io.on('reconnect', attempt => this.onReconnect(attempt))
  },

  beforeUnmount() {
    console.log('Lobby beforeUnmount')

    this.$socket.off('disconnect')
    this.$socket.off('player:players')
    this.$socket.off('chat:messages')
    this.$socket.off('chat:message')
    this.$socket.io.off('reconnect')
  },

  methods: {
    ...mapActions({
      loginGame: 'game/login',
      logoutGame: 'game/logout',
      addMessage: 'chat/addMessage',
      setPlayers: 'player/setPlayers',
      setMessages: 'chat/setMessages',
      deletePlayers: 'player/deletePlayers',
      deleteMessages: 'chat/deleteMessages'
    }),

    onDisconnect() {
      this.deletePlayers()
      this.deleteMessages()
    },

    // eslint-disable-next-line no-unused-vars
    onReconnect(attempt) {
      try {
        this.loginGame()
      } catch (error) {
        console.log(error)
      }
    },

    changeTab(tab) {
      this.activeTab = tab
    },

    changeState(STATE) {
      if (STATE === PLAYER_STATE.STANDBY) {
        this.$socket.emit('player:standBy')
      }

      if (STATE === PLAYER_STATE.IDLE) {
        this.$socket.emit('player:idle')
      }
    }
  }
}
</script>
