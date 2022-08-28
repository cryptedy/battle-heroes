<template>
  <div class="view-rankings">
    <div class="rankings">
      <header class="rankings-header">
        <h1>ランキング</h1>

        <BaseTab>
          <BaseTabList>
            <BaseTabListItem :rows="3">
              <router-link
                v-slot="{ isActive, href, navigate }"
                custom
                :to="{
                  name: 'rankings.weekly'
                }"
              >
                <a
                  :class="{ 'is-active': isActive }"
                  :href="href"
                  @click="navigate"
                >
                  週間
                </a>
              </router-link>
            </BaseTabListItem>
            <BaseTabListItem :rows="3">
              <router-link
                v-slot="{ isActive, href, navigate }"
                custom
                :to="{
                  name: 'rankings.monthly'
                }"
              >
                <a
                  :class="{ 'is-active': isActive }"
                  :href="href"
                  @click="navigate"
                >
                  月間
                </a>
              </router-link>
            </BaseTabListItem>
            <BaseTabListItem :rows="3">
              <router-link
                v-slot="{ isActive, href, navigate }"
                custom
                :to="{
                  name: 'rankings.total'
                }"
              >
                <a
                  :class="{ 'is-active': isActive }"
                  :href="href"
                  @click="navigate"
                >
                  累計
                </a>
              </router-link>
            </BaseTabListItem>
          </BaseTabList>
        </BaseTab>
      </header>

      <main class="rankings-main">
        <BaseTabContent>
          <router-view v-slot="{ Component }">
            <component :is="Component" />
          </router-view>
        </BaseTabContent>
      </main>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RankingsView'
}
</script>
