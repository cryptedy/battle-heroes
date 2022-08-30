<template>
  <div class="view-arena">
    <div class="arena">
      <header class="arena-header">
        <h1>バトルアリーナ</h1>

        <div class="arena-controls">
          <div class="arena-controls-primary">
            <!-- <p>最新の情報に更新</p> -->
            <!-- <p>通り名の設定</p> -->
            <!-- <p>遊び方</p> -->

            <div class="arena-controls-player">
              <BaseDrawer direction="bottom" :title="player.name">
                <template #trigger>
                  <PlayerAvatar :player="player" />
                </template>

                <PlayerDetail :player="player" />
                <NFTList :player="player" />
              </BaseDrawer>

              <div class="arena-controls-player-name">
                <p>{{ player.name }}</p>
                <a @click="handleChangeName"> 名前変更 </a>
              </div>

              <BaseDialog
                :open="dialogShown"
                title="プレイヤー名変更"
                @close="onCloseDialog"
              >
                <PlayerNameUpdate @update="onCloseDialog" />
              </BaseDialog>
            </div>
          </div>

          <div class="arena-controls-actions">
            <div class="arena-controls-battle-start">
              <BattleCreateButton />
            </div>

            <ToggleAudioButton />
          </div>
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
import NFTList from '@/components/NFTList'
import { PLAYER_TYPE } from '@/utils/constants'
import PlayerAvatar from '@/components/PlayerAvatar'
import PlayerDetail from '@/components/PlayerDetail'
import PlayerNameUpdate from '@/components/PlayerNameUpdate'
import ToggleAudioButton from '@/components/ToggleAudioButton'
import BattleJoinButton from '@/components/BattleJoinButton'
import BattleRushButton from '@/components/BattleRushButton'
import BattleCreateButton from '@/components/BattleCreateButton'
import BattleDeleteButton from '@/components/BattleDeleteButton'

export default {
  name: 'ArenaView',

  components: {
    NFTList,
    PlayerAvatar,
    PlayerDetail,
    PlayerNameUpdate,
    ToggleAudioButton,
    BattleJoinButton,
    BattleRushButton,
    BattleCreateButton,
    BattleDeleteButton
  },

  data() {
    return {
      dialogShown: false
    }
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
  },

  methods: {
    handleChangeName() {
      this.dialogShown = true
    },

    onCloseDialog() {
      this.dialogShown = false
    },

    onSelectNFT(NFT) {
      this.dialogShown = false

      this.execute(NFT)
    }
  }
}
</script>
