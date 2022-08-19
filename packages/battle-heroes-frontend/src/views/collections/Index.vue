<template>
  <div class="collections">
    <h1 class="collections-title">ヒーロー図鑑</h1>

    <BaseTab>
      <BaseTabList>
        <BaseTabListItem v-for="collection in collections" :key="collection.id">
          <router-link
            :to="{
              name: 'collections-show',
              params: { collectionId: collection.id }
            }"
          >
            {{ collection.name }}
          </router-link>
        </BaseTabListItem>
      </BaseTabList>
    </BaseTab>

    <router-view v-slot="{ Component }">
      <BaseTabContent type="page">
        <component :is="Component" :key="$route.path" />
      </BaseTabContent>
    </router-view>
  </div>
</template>

<script>
import { COLLECTIONS } from '@/utils/constants'

export default {
  name: 'Collections',

  data() {
    return {
      collections: COLLECTIONS
    }
  }
}
</script>
