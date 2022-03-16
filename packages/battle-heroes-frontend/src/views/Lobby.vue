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
          Your Heroes ({{
            player.token_ids[1].length + player.token_ids[2].length
          }})
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
      v-if="
        player.state === PLAYER_STATE.STANDBY ||
        player.state === PLAYER_STATE.BATTLE
      "
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
        <strong v-if="activeTab === 2">
          MESAGES({{ unreadMessageCount }})
        </strong>
        <span v-else> MESAGES({{ unreadMessageCount }}) </span>
      </a>
    </p>

    <Players v-if="activeTab === 1" />
    <Message v-else-if="activeTab === 2" />
  </LayoutMain>
</template>

<script>
import Message from '@/components/Message'
import Players from '@/components/Players'
import { mapGetters, mapActions } from 'vuex'
import LayoutMain from '@/components/LayoutMain'
import PlayerNFTs from '@/components/PlayerNFTs'
import { PLAYER_STATE } from '@/utils/constants'
import SplashScreen from '@/components/SplashScreen'

export default {
  name: 'Lobby',

  components: {
    Message,
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
      unreadMessageCount: 0,
      PLAYER_STATE: PLAYER_STATE
    }
  },

  computed: {
    ...mapGetters({
      messages: 'message/all',
      isGameLogin: 'game/isLogin',
      player: 'player/userPlayer',
      playerCount: 'player/count'
    })
  },

  watch: {
    messages: {
      handler(value, oldValue) {
        if (this.activeTab !== 2) {
          this.unreadMessageCount += value.length - oldValue.length
        }
      }
    },

    activeTab(value) {
      if (value === 2) {
        this.unreadMessageCount = 0
      }
    }
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
    this.$socket.on('message:messages', messages => this.setMessages(messages))
    this.$socket.on('game:matched', game => this.onMatched(game))
    this.$socket.io.on('reconnect', attempt => this.onReconnect(attempt))
  },

  beforeUnmount() {
    console.log('Lobby beforeUnmount')

    this.$socket.off('disconnect')
    this.$socket.off('player:players')
    this.$socket.off('message:messages')
    this.$socket.off('game:matched')
    this.$socket.io.off('reconnect')
  },

  methods: {
    ...mapActions({
      loginGame: 'game/login',
      setPlayers: 'player/set',
      logoutGame: 'game/logout',
      addMessage: 'message/add',
      setMessages: 'message/set',
      deletePlayers: 'player/delete',
      deleteMessages: 'message/delete'
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
    },

    onMatched(game) {
      console.log('onMatched')
      console.log(game)

      this.$router.push({
        name: 'games.show',
        params: {
          gameId: game.id
        }
      })
    }
  }
}
</script>
