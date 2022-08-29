<template>
  <div class="view-arena">
    <div class="arena">
      <header class="arena-header">
        <h1>バトルアリーナ</h1>

        <div class="arena-primary">
          <!-- <p>
            <img
              :src="player.avatar_url"
              :alt="player.name"
              width="32"
              height="32"
            />
          </p>
          <p>{{ player.name }}</p>
          <p>最新の情報に更新</p>
          <p>通り名の設定</p>
          <p>音量オンオフ</p>
          <p>遊び方</p> -->

          <BattleCreateButton />
        </div>

        <BaseTab>
          <BaseTabList>
            <BaseTabListItem :rows="3">
              <router-link
                v-slot="{ isExactActive, href, navigate }"
                custom
                :to="{
                  name: 'arena'
                }"
              >
                <a
                  :class="{ 'is-active': isExactActive }"
                  :href="href"
                  @click="navigate"
                >
                  バトル
                  <span
                    v-if="battleCount > 0"
                    class="label"
                    :class="{ 'is-active': battleCount > 0 }"
                  >
                    {{ battleCount }}
                  </span>
                </a>
              </router-link>
            </BaseTabListItem>
            <BaseTabListItem :rows="3">
              <router-link
                v-slot="{ isActive, href, navigate }"
                custom
                :to="{
                  name: 'arena.players'
                }"
              >
                <a
                  :class="{ 'is-active': isActive }"
                  :href="href"
                  @click="navigate"
                >
                  プレイヤー
                  <span
                    v-if="onlinePlayerCount > 0"
                    class="label"
                    :class="{ 'is-active': onlinePlayerCount > 0 }"
                  >
                    {{ onlinePlayerCount }}
                  </span>
                </a>
              </router-link>
            </BaseTabListItem>
            <BaseTabListItem :rows="3">
              <router-link
                v-slot="{ isActive, href, navigate }"
                custom
                :to="{
                  name: 'arena.chat'
                }"
              >
                <a
                  :class="{ 'is-active': isActive }"
                  :href="href"
                  @click="navigate"
                >
                  チャット
                  <span
                    v-if="unreadMessageCount > 0"
                    class="label"
                    :class="{ 'is-active': unreadMessageCount > 0 }"
                  >
                    {{ unreadMessageCount }}
                  </span>
                </a>
              </router-link>
            </BaseTabListItem>
          </BaseTabList>
        </BaseTab>
      </header>

      <main class="arena-main">
        <BaseTabContent>
          <router-view v-slot="{ Component }">
            <component :is="Component" :key="$route.path" />
          </router-view>
        </BaseTabContent>
      </main>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { PLAYER_TYPE } from '@/utils/constants'
import BattleJoinButton from '@/components/BattleJoinButton'
import BattleRushButton from '@/components/BattleRushButton'
import BattleCreateButton from '@/components/BattleCreateButton'
import BattleDeleteButton from '@/components/BattleDeleteButton'

export default {
  name: 'ArenaView',

  components: {
    BattleJoinButton,
    BattleRushButton,
    BattleCreateButton,
    BattleDeleteButton
  },

  computed: {
    ...mapGetters({
      battles: 'battle/all',
      player: 'game/player',
      players: 'player/all',
      findPlayer: 'player/find',
      playerBattle: 'game/playerBattle',
      unreadMessageCount: 'message/unreadCount'
    }),

    battleCount() {
      return this.battles.length
    },

    onlinePlayerCount() {
      return this.players.filter(
        player =>
          player.type === PLAYER_TYPE.HUMAN && player.socket_ids.length > 0
      ).length
    }
  }
}
</script>
