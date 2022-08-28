<template>
  <div class="view-account">
    <div class="account">
      <header class="account-header">
        <h1>アカウント</h1>

        <BaseTab>
          <BaseTabList>
            <BaseTabListItem :rows="2">
              <router-link
                v-slot="{ isExactActive, href, navigate }"
                custom
                :to="{
                  name: 'account.settings'
                }"
              >
                <a
                  :class="{ 'is-active': isExactActive }"
                  :href="href"
                  @click="navigate"
                >
                  設定
                </a>
              </router-link>
            </BaseTabListItem>
            <BaseTabListItem :rows="2">
              <router-link
                v-slot="{ isActive, href, navigate }"
                custom
                :to="{
                  name: 'account.labs'
                }"
              >
                <a
                  :class="{ 'is-active': isActive }"
                  :href="href"
                  @click="navigate"
                >
                  実験室
                </a>
              </router-link>
            </BaseTabListItem>
          </BaseTabList>
        </BaseTab>
      </header>

      <main class="account-main">
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
export default {
  name: 'AccountView'
}
</script>
