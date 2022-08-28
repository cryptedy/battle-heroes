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
                  <!-- <FontAwesomeIcon icon="users" /> -->
                  バトル
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
                  <!-- <FontAwesomeIcon icon="users" /> -->
                  プレイヤー
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
                  <!-- <FontAwesomeIcon icon="message" /> -->
                  チャット
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
      findPlayer: 'player/find',
      playerBattle: 'game/playerBattle'
    })
  }
}
</script>
