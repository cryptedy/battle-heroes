<template>
  <SplashScreen v-if="!isGameLogin" message="Connecting to game server..." />

  <BaseGrid v-else>
    <template v-if="!isGameShowPage">
      <header style="overflow: hidden">
        <BaseGridRow>
          <BaseGridColumn>
            <BaseDrawer>
              <template #trigger>
                <button>Your heroes</button>
              </template>

              <BaseGrid>
                <BaseGridRow>
                  <BaseGridColumn>
                    <BasePlayerAvatar :player="player" />

                    <p>
                      <strong>{{ player.name }} heroes</strong>
                    </p>

                    <hr />

                    <PlayerNFTs :player="player" />
                  </BaseGridColumn>
                </BaseGridRow>
              </BaseGrid>
            </BaseDrawer>

            <BaseMenu>
              <template #trigger>
                <BasePlayerAvatar
                  :player="player"
                  style="float: right; overflow: hidden"
                />
              </template>

              <BaseGrid>
                <BaseGridRow>
                  <BaseGridColumn>
                    <p>
                      <strong>{{ player.name }}</strong>
                      -
                      <router-link :to="{ name: 'logout' }">
                        Logout
                      </router-link>
                    </p>

                    <p>Level: {{ player.level }}</p>
                    <p>Player ID: {{ player.id }}</p>
                    <p>Address: {{ player.address }}</p>
                    <p>Login from {{ player.socket_ids.length }} devices</p>
                    <p>state: {{ $filters.playerState(player.state) }}</p>
                  </BaseGridColumn>
                </BaseGridRow>
              </BaseGrid>
            </BaseMenu>
          </BaseGridColumn>
        </BaseGridRow>
      </header>

      <hr />

      <nav>
        <BaseGridRow>
          <BaseGridColumn>
            Chnage your state to:
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
          </BaseGridColumn>

          <BaseGridColumn>
            <router-link
              v-slot="{ href, route, navigate }"
              custom
              :to="{ name: 'players' }"
            >
              <a :href="href" @click="navigate">
                <strong v-if="$route.path.startsWith(route.path)">
                  PLAYERS({{ playerCount }})
                </strong>
                <span v-else> PLAYERS({{ playerCount }}) </span>
              </a>
            </router-link>
            <router-link
              v-slot="{ href, route, navigate }"
              custom
              :to="{ name: 'messages' }"
            >
              <a :href="href" @click="navigate">
                <strong v-if="$route.path.startsWith(route.path)">
                  MESSAGES({{ unreadMessageCount }})
                </strong>
                <span v-else> MESSAGES({{ unreadMessageCount }}) </span>
              </a>
            </router-link>
            <router-link
              v-slot="{ href, route, navigate }"
              custom
              :to="{ name: 'games' }"
            >
              <a :href="href" @click="navigate">
                <strong v-if="$route.path.startsWith(route.path)">
                  GAMES({{ gameCount }})
                </strong>
                <span v-else> GAMES({{ gameCount }}) </span>
              </a>
            </router-link>
          </BaseGridColumn>
        </BaseGridRow>
      </nav>
    </template>

    <BaseGridRow>
      <BaseGridColumn>
        <slot />
      </BaseGridColumn>
    </BaseGridRow>
  </BaseGrid>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { PLAYER_STATE } from '@/utils/constants'
import PlayerNFTs from '@/components/PlayerNFTs'
import SplashScreen from '@/components/SplashScreen'

export default {
  name: 'LayoutMain',

  components: {
    PlayerNFTs,
    SplashScreen
  },

  data() {
    return {
      unreadMessageCount: 0
    }
  },

  computed: {
    ...mapGetters({
      game: 'auth/game',
      player: 'auth/player',
      gameCount: 'game/count',
      messages: 'message/all',
      playerNFTs: 'NFT/byPlayer',
      playerCount: 'player/count',
      isGameLogin: 'auth/isGameLogin'
    }),

    PLAYER_STATE() {
      return PLAYER_STATE
    },

    isMessagePage() {
      return this.$route.name === 'messages'
    },

    isGameShowPage() {
      return this.$route.name === 'games.show'
    }
  },

  watch: {
    messages(value, oldValue) {
      if (!this.isMessagePage) {
        this.unreadMessageCount += value.length - oldValue.length
      }
    }
  },

  async created() {
    console.log('LayoutMain created')

    if (!this.isGameLogin) {
      try {
        await this.loginGame()
      } catch (error) {
        console.log(error)
      }
    }

    if (this.game) {
      this.$router.push({
        name: 'games.show',
        params: {
          gameId: this.game.id
        }
      })
    }
  },

  mounted() {
    console.log('LayoutMain mounted')

    this.$socket.on('connect', () => this.onConnect())
    this.$socket.on('disconnect', () => this.onDisconnect())
    this.$socket.on('player:players', players => this.setPlayers(players))
    this.$socket.on('message:messages', messages => this.setMessages(messages))
    this.$socket.on('game:games', games => this.setGames(games))
    this.$socket.on('game:matched', game => this.onMatched(game))
  },

  beforeUnmount() {
    console.log('LayoutMain beforeUnmount')

    this.$socket.off('connect')
    this.$socket.off('disconnect')
    this.$socket.off('player:players')
    this.$socket.off('message:messages')
    this.$socket.off('game:games')
    this.$socket.off('game:matched')
  },

  methods: {
    ...mapActions({
      setGames: 'game/set',
      loginGame: 'game/login',
      logoutGame: 'game/logout',
      setPlayers: 'player/set',
      setMessages: 'message/set'
    }),

    async onConnect() {
      try {
        await this.loginGame()
      } catch (error) {
        console.log(error)
      }

      if (this.game) {
        this.$router.push({
          name: 'games.show',
          params: {
            gameId: this.game.id
          }
        })
      }
    },

    onDisconnect() {
      if (this.isGameLogin) {
        try {
          this.logoutGame()
        } catch (error) {
          console.log(error)
        }
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
