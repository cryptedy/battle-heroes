<template>
  <BaseEmpty v-if="!NFTs.length > 0" text="NO NFTs" />

  <div v-else>
    <ThePagination
      :pagination="pagination"
      @update:page="onPageUpdate($event)"
    />

    <BaseList class="nft-list">
      <NFTListItem v-for="NFT in paginatedNFTs" :key="NFT.id" :nft="NFT" />
    </BaseList>

    <ThePagination
      :pagination="pagination"
      @update:page="onPageUpdate($event)"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import NFTListItem from '@/components/NFTListItem'
import ThePagination from '@/components/ThePagination'

export default {
  name: 'Herodex',

  components: {
    NFTListItem,
    ThePagination
  },

  props: {
    collection: {
      type: Object,
      required: true
    }
  },

  data() {
    return {
      page: 1,
      perPage: 50
    }
  },

  computed: {
    ...mapGetters({
      NFTsByCollection: 'NFT/byCollection'
    }),

    NFTs() {
      return this.NFTsByCollection(this.collection)
    },

    pagination() {
      const currentPage = this.page
      const total = this.filteredNFTs.length
      const perPage = this.perPage
      const lastPage = Math.ceil(total / perPage)
      const from = total > 0 ? (currentPage - 1) * perPage + 1 : null
      let to = total > 0 ? from + perPage - 1 : null

      if (currentPage === lastPage) {
        to = total
      }

      return {
        current_page: currentPage,
        from: from,
        last_page: lastPage,
        per_page: perPage,
        to: to,
        total: total
      }
    },

    filteredNFTs() {
      let filteredNFTs = this.NFTs

      return filteredNFTs
    },

    paginatedNFTs() {
      return this.filteredNFTs.filter(
        (NFT, index) =>
          index >=
            (this.pagination.current_page - 1) * this.pagination.per_page &&
          index < this.pagination.current_page * this.pagination.per_page
      )
    }
  },

  created() {
    this.page = this.$route.query.page || 1
  },

  methods: {
    onPageUpdate(page) {
      this.page = page
    }
  }
}
</script>
