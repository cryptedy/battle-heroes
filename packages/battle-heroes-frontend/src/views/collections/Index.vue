<template>
  <div class="herodex">
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
      <!-- <BaseTabContent type="page"> -->
      <component :is="Component" />
      <!-- </BaseTabContent> -->
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
