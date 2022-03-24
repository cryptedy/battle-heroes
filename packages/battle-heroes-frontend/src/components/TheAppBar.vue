<template>
  <div class="app-bar">
    <nav class="app-bar-item app-bar-nav">
      <ul class="app-bar-nav-list">
        <router-link
          v-slot="{ isActive, href, navigate }"
          custom
          :to="{ name: 'home' }"
        >
          <li class="app-bar-nav-list-item">
            <a
              class="app-bar-nav-list-item-link"
              :class="{ 'is-active': isActive }"
              :href="href"
              @click="navigate"
            >
              <FontAwesomeIcon icon="house" />
              <span class="app-bar-nav-list-item-link-text"> HOME </span>
            </a>
          </li>
        </router-link>
        <router-link
          v-slot="{ isActive, href, navigate }"
          custom
          :to="{ name: 'battles' }"
        >
          <li class="app-bar-nav-list-item">
            <a
              class="app-bar-nav-list-item-link"
              :href="href"
              :class="{ 'is-active': isActive }"
              @click="navigate"
            >
              <FontAwesomeIcon icon="fire" />
              <span class="app-bar-nav-list-item-link-text"> BATTLES </span>
            </a>
          </li>
        </router-link>
        <router-link
          v-slot="{ isActive, href, navigate }"
          custom
          :to="{ name: 'players' }"
        >
          <li class="app-bar-nav-list-item">
            <a
              class="app-bar-nav-list-item-link"
              :href="href"
              :class="{ 'is-active': isActive }"
              @click="navigate"
            >
              <FontAwesomeIcon icon="users" />
              <span class="app-bar-nav-list-item-link-text">PLAYERS</span>
            </a>
          </li>
        </router-link>
        <router-link
          v-slot="{ isActive, href, navigate }"
          custom
          :to="{ name: 'messages' }"
        >
          <li class="app-bar-nav-list-item">
            <a
              class="app-bar-nav-list-item-link"
              :href="href"
              :class="{ 'is-active': isActive }"
              @click="navigate"
            >
              <FontAwesomeIcon icon="message" />
              <span class="app-bar-nav-list-item-link-text">MESSAGES</span>
            </a>
          </li>
        </router-link>
      </ul>
    </nav>

    <nav class="app-bar-item app-bar-nav">
      <ul class="app-bar-nav-list">
        <li class="app-bar-nav-list-item">
          <BaseMenu align="right">
            <template #trigger>
              <PlayerAvatar :player="player" />
            </template>
            <p>name: {{ player.name }}</p>
            <p>Level: {{ player.level }}</p>
            <p>Player ID: {{ player.id }}</p>
            <p>Address: {{ player.address }}</p>
            <p>Login from {{ player.socket_ids.length }} devices</p>
            <p>state: {{ $filters.playerState(player.state) }}</p>
            <p>
              <router-link :to="{ name: 'settings.account' }">
                ACCOUNT SETTINGS
              </router-link>
            </p>
            <p>
              <router-link :to="{ name: 'logout' }"> LOGOUT </router-link>
            </p>
          </BaseMenu>
        </li>
      </ul>
    </nav>

    <div class="app-bar-item app-bar-stats">
      <ul class="app-bar-stats-list">
        <li class="app-bar-stats-list-item is-level">
          <span class="app-bar-stats-list-item-text">Lv 1</span>
        </li>
        <li class="app-bar-stats-list-item is-won">
          <span class="app-bar-stats-list-item-text">WIN 0</span>
        </li>
        <li class="app-bar-stats-list-item is-lost">
          <span class="app-bar-stats-list-item-text">LOSE 0</span>
        </li>
        <li class="app-bar-stats-list-item is-heroes-count">
          <FontAwesomeIcon icon="layer-group" />
          <span class="app-bar-stats-list-item-text">
            {{ player.nft_ids.length }}
          </span>
        </li>
        <li class="app-bar-stats-list-item">
          <PlayerState :player="player" />

          <div
            v-if="playerBattle"
            style="margin-left: 16px; width: 32px; height: 32px"
          >
            <img
              style="width: 100%; height: auto"
              :src="playerBattle.player.NFT.image_url"
              :alt="playerBattle.player.NFT.name"
              width="512"
              height="512"
            />
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import PlayerState from '@/components/PlayerState'
import PlayerAvatar from '@/components/PlayerAvatar'

export default {
  name: 'TheAppBar',

  components: {
    PlayerState,
    PlayerAvatar
  },

  computed: {
    ...mapGetters({
      player: 'game/player',
      playerBattle: 'game/battle'
    })
  }
}
</script>
