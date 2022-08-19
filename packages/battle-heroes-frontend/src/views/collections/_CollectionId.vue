<template>
  <Herodex :collection="collection" />
</template>

<script>
import Herodex from '@/components/Herodex'
import { COLLECTIONS } from '@/utils/constants'

export default {
  name: 'CollectionShow',

  components: {
    Herodex
  },

  data() {
    return {
      collectionId: 1,
      collections: COLLECTIONS
    }
  },

  computed: {
    collection() {
      return this.collections.find(
        collection => collection.id == this.$route.params.collectionId
      )
    }
  },

  created() {
    this.collectionId = Number.parseInt(this.$route.params.collectionId) || 1
  }
}
</script>
