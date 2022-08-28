<template>
  <div class="view-exchange">
    <div class="exchange">
      <header class="exchange-header">
        <h1>取引所</h1>

        <BaseTab>
          <BaseTabList>
            <BaseTabListItem :rows="2">
              <router-link
                v-slot="{ isActive, href, navigate }"
                custom
                :to="{
                  name: 'exchange.tokens'
                }"
              >
                <a
                  :class="{ 'is-active': isActive }"
                  :href="href"
                  @click="navigate"
                >
                  トークン交換所
                </a>
              </router-link>
            </BaseTabListItem>
            <BaseTabListItem :rows="2">
              <router-link
                v-slot="{ isActive, href, navigate }"
                custom
                :to="{
                  name: 'exchange.items'
                }"
              >
                <a
                  :class="{ 'is-active': isActive }"
                  :href="href"
                  @click="navigate"
                >
                  アイテムショップ
                </a>
              </router-link>
            </BaseTabListItem>
          </BaseTabList>
        </BaseTab>
      </header>

      <main class="exchange-main">
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
import { mapGetters } from 'vuex'

export default {
  name: 'ExchangeView',

  components: {
    //
  },

  computed: {
    ...mapGetters({
      //
    })
  }
}
</script>
