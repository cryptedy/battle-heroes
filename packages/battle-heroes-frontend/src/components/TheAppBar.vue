<template>
  <div class="app-bar">
    <nav class="app-bar-item app-bar-nav">
      <ul class="app-bar-nav-list">
        <router-link
          v-slot="{ isActive, href, navigate }"
          custom
          :to="{ name: 'arena' }"
        >
          <li class="app-bar-nav-list-item">
            <a
              class="app-bar-nav-list-item-link"
              :class="{ 'is-active': isActive }"
              :href="href"
              @click="navigate"
            >
              <FontAwesomeIcon icon="khanda" />
              <span class="app-bar-nav-list-item-link-text"> アリーナ </span>
            </a>
          </li>
        </router-link>
        <router-link
          v-slot="{ isActive, href, navigate }"
          custom
          :to="{ name: 'rankings' }"
        >
          <li class="app-bar-nav-list-item">
            <a
              class="app-bar-nav-list-item-link"
              :href="href"
              :class="{ 'is-active': isActive }"
              @click="navigate"
            >
              <FontAwesomeIcon icon="ranking-star" />
              <span class="app-bar-nav-list-item-link-text"> ランキング </span>
            </a>
          </li>
        </router-link>
        <router-link
          v-slot="{ isActive, href, navigate }"
          custom
          :to="{ name: 'exchange' }"
        >
          <li class="app-bar-nav-list-item">
            <a
              class="app-bar-nav-list-item-link"
              :href="href"
              :class="{ 'is-active': isActive }"
              @click="navigate"
            >
              <FontAwesomeIcon icon="store" />
              <span class="app-bar-nav-list-item-link-text"> 取引所 </span>
            </a>
          </li>
        </router-link>
        <router-link
          v-slot="{ isActive, href, navigate }"
          custom
          :to="{ name: 'herodex' }"
        >
          <li class="app-bar-nav-list-item">
            <a
              class="app-bar-nav-list-item-link"
              :href="href"
              :class="{ 'is-active': isActive }"
              @click="navigate"
            >
              <FontAwesomeIcon icon="book-journal-whills" />
              <span class="app-bar-nav-list-item-link-text">
                ヒーロー図鑑
              </span>
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

            <div class="account-menu">
              <BaseList class="account-menu-list">
                <BaseListItem class="account-menu-list-item">
                  <router-link
                    :to="{ name: 'account.settings' }"
                    class="account-menu-list-item-link"
                  >
                    <FontAwesomeIcon icon="user" />
                    アカウント設定
                  </router-link>
                </BaseListItem>
                <BaseListItem class="account-menu-list-item">
                  <router-link
                    :to="{ name: 'account.labs' }"
                    class="account-menu-list-item-link"
                  >
                    <FontAwesomeIcon icon="flask-vial" />
                    Labs
                  </router-link>
                </BaseListItem>
                <BaseListItem class="account-menu-list-item">
                  <router-link
                    :to="{ name: 'logout' }"
                    class="account-menu-list-item-link"
                  >
                    <FontAwesomeIcon icon="arrow-right-from-bracket" />
                    ログアウト
                  </router-link>
                </BaseListItem>
              </BaseList>
            </div>
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
      </ul>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import PlayerAvatar from '@/components/PlayerAvatar'

export default {
  name: 'TheAppBar',

  components: {
    PlayerAvatar
  },

  computed: {
    ...mapGetters({
      player: 'game/player',
      playerNFT: 'battle/playerNFT',
      playerBattle: 'game/playerBattle'
    })
  }
}
</script>
