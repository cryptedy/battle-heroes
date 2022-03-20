<template>
  <SplashScreen v-if="!isGameLogin" message="Connecting to game server..." />

  <template v-else>
    <div class="app-bar-section">
      <div class="app-bar">
        <nav class="app-bar-nav" style="order: 0; margin-right: 24px">
          <ul class="app-bar-nav-list">
            <router-link
              v-slot="{ isActive, href, navigate }"
              custom
              :to="{ name: 'home' }"
            >
              <li
                class="app-bar-nav-list-item"
                :class="{ 'is-active': isActive }"
              >
                <a :href="href" @click="navigate">
                  <FontAwesomeIcon icon="house" size="2x" />
                  <span class="app-bar-nav-list-item-text"> HOME </span>
                </a>
              </li>
            </router-link>
            <router-link
              v-slot="{ isActive, href, navigate }"
              custom
              :to="{ name: 'games' }"
            >
              <li
                class="app-bar-nav-list-item"
                :class="{ 'is-active': isActive }"
              >
                <a :href="href" @click="navigate">
                  <FontAwesomeIcon icon="fire" size="2x" />
                  <span class="app-bar-nav-list-item-text"> BATTLES </span>
                </a>
              </li>
            </router-link>
            <router-link
              v-slot="{ isActive, href, navigate }"
              custom
              :to="{ name: 'players' }"
            >
              <li
                class="app-bar-nav-list-item"
                :class="{ 'is-active': isActive }"
              >
                <a :href="href" @click="navigate">
                  <FontAwesomeIcon icon="users" size="2x" />
                  <span class="app-bar-nav-list-item-text">PLAYERS</span>
                </a>
              </li>
            </router-link>
            <router-link
              v-slot="{ isActive, href, navigate }"
              custom
              :to="{ name: 'messages' }"
            >
              <li
                class="app-bar-nav-list-item"
                :class="{ 'is-active': isActive }"
              >
                <a :href="href" @click="navigate">
                  <FontAwesomeIcon icon="message" size="2x" />
                  <span class="app-bar-nav-list-item-text">MESSAGES</span>
                </a>
              </li>
            </router-link>
          </ul>
        </nav>

        <nav class="app-bar-nav" style="order: 2; width: 42px">
          <ul class="app-bar-nav-list" style="justify-content: flex-end">
            <li class="app-bar-nav-list-item">
              <BaseMenu align="right">
                <template #trigger>
                  <PlayerAvatar :player="player" />
                </template>
                <p>Level: {{ player.level }}</p>
                <p>Player ID: {{ player.id }}</p>
                <p>Address: {{ player.address }}</p>
                <p>Login from {{ player.socket_ids.length }} devices</p>
                <p>state: {{ $filters.playerState(player.state) }}</p>
                <p>
                  <router-link :to="{ name: 'logout' }"> LOGOUT </router-link>
                </p>
              </BaseMenu>
            </li>
          </ul>
        </nav>

        <div class="app-bar-info" style="order: 1">
          <ul class="app-bar-info-list">
            <li class="app-bar-info-list-item is-level">
              <FontAwesomeIcon icon="star" size="1x" />
              <span class="app-bar-info-list-item-text">1</span>
            </li>
            <li class="app-bar-info-list-item is-heroes-count">
              <FontAwesomeIcon icon="layer-group" size="1x" />
              <span class="app-bar-info-list-item-text">
                {{ player.token_ids[1].length + player.token_ids[2].length }}
              </span>
            </li>
            <li class="app-bar-info-list-item is-won">
              <FontAwesomeIcon icon="sun" size="1x" />
              <span class="app-bar-info-list-item-text">0</span>
            </li>
            <li class="app-bar-info-list-item is-lost">
              <FontAwesomeIcon icon="cloud-showers-heavy" size="1x" />
              <span class="app-bar-info-list-item-text">0</span>
            </li>
            <li class="app-bar-info-list-item">
              <span class="player-status is-standby">STANBY</span>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <div class="main-section">
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

      <slot />
    </div>

    <nav class="bottom-nav-section">
      <div class="bottom-nav">
        <ul class="bottom-nav-list">
          <router-link
            v-slot="{ isActive, href, navigate }"
            custom
            :to="{ name: 'home' }"
          >
            <li class="bottom-nav-list-item" :class="{ 'is-active': isActive }">
              <a :href="href" @click="navigate">
                <FontAwesomeIcon icon="house" size="2x" />
              </a>
            </li>
          </router-link>
          <router-link
            v-slot="{ isActive, href, navigate }"
            custom
            :to="{ name: 'games' }"
          >
            <li class="bottom-nav-list-item" :class="{ 'is-active': isActive }">
              <a :href="href" @click="navigate">
                <FontAwesomeIcon icon="fire" size="2x" />
              </a>
            </li>
          </router-link>
          <router-link
            v-slot="{ isActive, href, navigate }"
            custom
            :to="{ name: 'players' }"
          >
            <li class="bottom-nav-list-item" :class="{ 'is-active': isActive }">
              <a :href="href" @click="navigate">
                <FontAwesomeIcon icon="users" size="2x" />
              </a>
            </li>
          </router-link>
          <router-link
            v-slot="{ isActive, href, navigate }"
            custom
            :to="{ name: 'messages' }"
          >
            <li class="bottom-nav-list-item" :class="{ 'is-active': isActive }">
              <a :href="href" @click="navigate">
                <FontAwesomeIcon icon="message" size="2x" />
              </a>
            </li>
          </router-link>
          <li class="bottom-nav-list-item">
            <a href="#">
              <FontAwesomeIcon icon="user" size="2x" />
            </a>
          </li>
        </ul>
      </div>
    </nav>
  </template>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { PLAYER_STATE } from '@/utils/constants'
import PlayerNFTs from '@/components/PlayerNFTs'
import PlayerAvatar from '@/components/PlayerAvatar'
import SplashScreen from '@/components/SplashScreen'

export default {
  name: 'LayoutMain',

  components: {
    // eslint-disable-next-line vue/no-unused-components
    PlayerNFTs,
    PlayerAvatar,
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

<style lang="scss">
.main-section {
  margin: 0 auto;
  max-width: 1140px;
  padding: 0 24px;
  height: calc(100vh - 90px);
  padding-right: 0;
  padding-left: 0;
  padding-top: 56px;
  @include mediaQuery(md) {
    padding-top: 70px;
    height: 100%;
  }
}

.app-bar-section {
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  width: 100%;
  height: 56px;
  @include mediaQuery(md) {
    height: 70px;
  }
  border-bottom: 1px solid color(divider, light);
  background: palette(grey, 800);
}

.bottom-nav-section {
  @include mediaQuery(md) {
    display: none;
  }

  position: fixed;
  bottom: 0;
  width: 100%;
  height: 90px;
  border-top: 1px solid color(divider, light);
  background: palette(grey, 800);
}

.app-bar {
  display: flex;
  margin: 0 auto;
  max-width: 1140px;
  padding: 0 24px;
  width: 100%;
  height: 100%;

  &-nav {
    display: none;
    @include mediaQuery(md) {
      display: block;
    }
    width: 100%;
    height: 100%;

    &-list {
      display: flex;
      width: 100%;
      height: 100%;

      &-item {
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 56px;
        @include mediaQuery(lg) {
          margin-right: 34px;
        }

        > a {
          display: flex;
          align-items: center;
        }

        &:last-child {
          margin-right: 0;
        }
        position: relative;

        &.is-active {
          .svg-inline--fa {
            color: palette(blue, 500);
          }

          .app-bar-nav-list-item-text {
            color: palette(blue, 500);
          }
        }

        .svg-inline--fa {
          color: color(inactive-icon, light);
        }

        &-text {
          display: none;
          @include mediaQuery(lg) {
            display: inline;
          }
          margin-left: 12px;
          color: color(secondary, light);
        }
      }
    }
  }

  &-info {
    width: 100%;
    height: 100%;
    margin: 0;
    @include mediaQuery(md) {
      margin: 0 32px;
    }

    &-list {
      display: flex;
      justify-content: space-around;
      align-items: center;
      width: 100%;
      height: 100%;

      &-item {
        display: flex;
        align-items: center;
        justify-content: center;

        position: relative;

        // &.is-level {
        //   .svg-inline--fa {
        //     color: palette(yellow, 500);
        //   }
        //   .app-bar-info-item-text {
        //     font-weight: bold;
        //     color: palette(yellow, 500);
        //   }
        // }
        // &.is-heroes-count {
        //   .svg-inline--fa {
        //     color: palette(green, 500);
        //   }
        //   .app-bar-info-item-text {
        //     font-weight: bold;
        //     color: palette(green, 500);
        //   }
        // }
        // &.is-won {
        //   .svg-inline--fa {
        //     color: palette(orange, 500);
        //   }
        //   .app-bar-info-item-text {
        //     font-weight: bold;
        //     color: palette(orange, 500);
        //   }
        // }
        // &.is-lost {
        //   .svg-inline--fa {
        //     color: palette(blue, 500);
        //   }
        //   .app-bar-info-item-text {
        //     font-weight: bold;
        //     color: palette(blue, 500);
        //   }
        // }

        &-text {
          margin-left: 6px;
          @include mediaQuery(md) {
            margin-left: 8px;
          }
        }
      }
    }
  }
}

.bottom-nav {
  display: flex;
  width: 100%;
  height: 100%;

  &-list {
    display: flex;
    width: 100%;
    height: 100%;

    &-item {
      display: flex;
      justify-content: center;
      align-items: center;
      flex-grow: 1;
      position: relative;

      .svg-inline--fa {
        color: color(inactive-icon, light);
      }

      &.is-active {
        .svg-inline--fa {
          color: palette(blue, 500);
        }
      }

      &-text {
        display: none;
        @media (min-width: 700px) {
          display: flex;
        }
      }
    }
  }
}
</style>
