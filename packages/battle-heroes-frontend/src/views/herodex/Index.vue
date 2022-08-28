<template>
  <div class="view-herodex">
    <div class="herodex">
      <header class="herodex-header">
        <h1>ヒーロー図鑑</h1>

        <BaseTab>
          <BaseTabList>
            <BaseTabListItem
              v-for="collection in collections"
              :key="collection.id"
              :rows="collections.length"
            >
              <router-link
                v-slot="{ isActive, href, navigate }"
                custom
                :to="{
                  name: 'herodex.show',
                  params: { collectionId: collection.id }
                }"
              >
                <a
                  :class="{ 'is-active': isActive }"
                  :href="href"
                  @click="navigate"
                >
                  <span class="herodex-collections-name">
                    {{ collection.name }}
                  </span>
                  <span class="herodex-collections-name-short">
                    {{ collection.name_short }}
                  </span>
                </a>
              </router-link>
            </BaseTabListItem>
          </BaseTabList>
        </BaseTab>
      </header>

      <main class="herodex-main">
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
import { COLLECTIONS } from '@/utils/constants'

export default {
  name: 'HerodexView',

  data() {
    return {
      collections: COLLECTIONS
    }
  }
}
</script>
