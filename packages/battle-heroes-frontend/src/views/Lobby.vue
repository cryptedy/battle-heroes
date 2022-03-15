<template>
  <SplashScreen v-if="!isGameLogin" message="Connecting to game server..." />
  <LayoutMain v-else>
    <p>
      <strong>{{ player.name }}</strong>
      -
      <router-link :to="{ name: 'logout' }"> Logout </router-link>
    </p>

    <BasePlayerAvatar :player="player" />

    <p>Level: {{ player.level }}</p>
    <p>Player ID: {{ player.id }}</p>
    <p>Address: {{ player.address }}</p>
    <p>Login from {{ player.socket_ids.length }} devices</p>
    <p>state: {{ $filters.playerState(player.state) }}</p>

    <base-accordion :open="false">
      <template #trigger="scopeProps">
        <a style="color: blue; cursor: pointer">
          <span v-if="scopeProps.show">▼</span>
          <span v-else>▶</span>
          Your Heroes (
          {{ player.token_ids[1].length + player.token_ids[2].length }}
          )
        </a>
      </template>
      <template #contents>
        <PlayerNFTs :player="player" />
      </template>
    </base-accordion>

    <hr />

    <button
      v-if="player.state === PLAYER_STATE.IDLE"
      @click="changePlayerState(PLAYER_STATE.STANDBY)"
    >
      STAND-BY
    </button>
    <button
      v-if="player.state === PLAYER_STATE.STANDBY"
      @click="changePlayerState(PLAYER_STATE.IDLE)"
    >
      IDLE
    </button>

    <hr />

    <p>
      <a href="#" @click="changeTab(1)">
        <strong v-if="activeTab === 1"> PLAYERS({{ playerCount }}) </strong>
        <span v-else> PLAYERS({{ playerCount }}) </span>
      </a>
      -
      <a href="#" @click="changeTab(2)">
        <strong v-if="activeTab === 2"> CHAT </strong>
        <span v-else> CHAT </span>
      </a>
    </p>

    <Players v-if="activeTab === 1" />
    <Chat v-else-if="activeTab === 2" />
  </LayoutMain>
</template>

<script>
import Chat from '@/components/Chat'
import Players from '@/components/Players'
import { mapGetters, mapActions } from 'vuex'
import LayoutMain from '@/components/LayoutMain'
import PlayerNFTs from '@/components/PlayerNFTs'
import { PLAYER_STATE } from '@/utils/constants'
import SplashScreen from '@/components/SplashScreen'

export default {
  name: 'Lobby',

  components: {
    Chat,
    Players,
    LayoutMain,
    PlayerNFTs,
    SplashScreen
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
      player: 'player/userPlayer',
      playerCount: 'player/count'
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
      setPlayers: 'player/set',
      logoutGame: 'game/logout',
      addMessage: 'chat/addMessage',
      deletePlayers: 'player/delete',
      setMessages: 'chat/setMessages',
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

    changePlayerState(STATE) {
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
