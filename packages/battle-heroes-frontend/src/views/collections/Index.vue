<template>
  <div class="collections">
    <header class="collections-header">
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
                name: 'collections.show',
                params: { collectionId: collection.id }
              }"
            >
              <a
                :class="{ 'is-active': isActive }"
                :href="href"
                @click="navigate"
              >
                <span class="collections-name">
                  {{ collection.name }}
                </span>
                <span class="collections-name-short">
                  {{ collection.name_short }}
                </span>
              </a>
            </router-link>
          </BaseTabListItem>
        </BaseTabList>
      </BaseTab>
    </header>

    <main class="collections-main">
      <BaseTabContent>
        <router-view v-slot="{ Component }">
          <component :is="Component" :key="$route.path" />
        </router-view>
      </BaseTabContent>
    </main>
  </div>
</template>

<script>
import { COLLECTIONS } from '@/utils/constants'

export default {
  name: 'CollectionsView',

  data() {
    return {
      collections: COLLECTIONS
    }
  }
}
</script>
