<template>
  <div class="app-bar">
    <nav class="app-bar-item app-bar-nav">
      <ul class="app-bar-nav-list">
        <router-link
          v-slot="{ isActive, href, navigate }"
          custom
          :to="{ name: 'home' }"
        >
          <li class="app-bar-nav-list-item" :class="{ 'is-active': isActive }">
            <a :href="href" @click="navigate">
              <FontAwesomeIcon icon="house" size="2x" />
              <span class="app-bar-nav-list-item-text"> HOME </span>
            </a>
          </li>
        </router-link>
        <router-link
          v-slot="{ isActive, href, navigate }"
          custom
          :to="{ name: 'battles' }"
        >
          <li class="app-bar-nav-list-item" :class="{ 'is-active': isActive }">
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
          <li class="app-bar-nav-list-item" :class="{ 'is-active': isActive }">
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
          <li class="app-bar-nav-list-item" :class="{ 'is-active': isActive }">
            <a :href="href" @click="navigate">
              <FontAwesomeIcon icon="message" size="2x" />
              <span class="app-bar-nav-list-item-text">MESSAGES</span>
            </a>
          </li>
        </router-link>
      </ul>
    </nav>

    <nav class="app-bar-item app-bar-nav">
      <ul class="app-bar-nav-list" style="justify-content: flex-end">
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

    <div class="app-bar-item app-bar-info">
      <ul class="app-bar-info-list">
        <li class="app-bar-info-list-item is-level">
          <FontAwesomeIcon icon="star" size="1x" />
          <span class="app-bar-info-list-item-text">1</span>
        </li>
        <li class="app-bar-info-list-item is-heroes-count">
          <FontAwesomeIcon icon="layer-group" size="1x" />
          <span class="app-bar-info-list-item-text">
            {{ player.nft_ids.length }}
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
          <PlayerState :player="player" />
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
      player: 'game/player'
    })
  }
}
</script>
