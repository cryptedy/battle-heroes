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
            <AccountMenu :player="player" />
          </BaseMenu>
        </li>
      </ul>
    </nav>

    <div class="app-bar-item app-bar-content">
      <ul class="app-bar-content-list">
        <li class="app-bar-content-list-item">
          <span class="app-bar-content-list-item-text">
            EXP {{ player.exp }}
          </span>
        </li>
        <li class="app-bar-content-list-item">
          <span class="app-bar-content-list-item-text">
            WIN {{ player.win }}
          </span>
        </li>
        <li class="app-bar-content-list-item">
          <span class="app-bar-content-list-item-text">
            LOSE {{ player.lose }}
          </span>
        </li>
        <li class="app-bar-content-list-item">
          <FontAwesomeIcon icon="layer-group" />
          <span class="app-bar-content-list-item-text">
            {{ player.nft_ids.length }}
          </span>
        </li>
        <li class="app-bar-content-list-item">
          <div
            v-if="playerNFT"
            style="margin-right: 12px; width: 32px; height: 32px"
          >
            <img
              style="width: 100%; height: auto; border-radius: 2px"
              :src="playerNFT.image_url"
              :alt="playerNFT.name"
              width="512"
              height="512"
            />
          </div>

          <BattleCreateButton />

          <BattleDeleteButton />
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import AccountMenu from '@/components/AccountMenu'
import PlayerAvatar from '@/components/PlayerAvatar'
import BattleCreateButton from '@/components/BattleCreateButton'
import BattleDeleteButton from '@/components/BattleDeleteButton'

export default {
  name: 'TheAppBar',

  components: {
    AccountMenu,
    PlayerAvatar,
    BattleCreateButton,
    BattleDeleteButton
  },

  computed: {
    ...mapGetters({
      player: 'game/player',
      playerNFT: 'battle/playerNFT'
    })
  }
}
</script>
