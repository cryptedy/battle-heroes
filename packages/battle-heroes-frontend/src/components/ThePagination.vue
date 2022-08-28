<template>
  <div v-if="pages.length > 0" class="pagination">
    <ul class="pagination-navigation">
      <li>
        <a
          v-if="hasPrevious"
          aria-label="前へ"
          :class="{ 'is-active': hasPrevious }"
          @click.prevent="changePage(currentPage - 1)"
        >
          <FontAwesomeIcon icon="chevron-left" />
        </a>

        <span v-else class="is-disabled">
          <FontAwesomeIcon icon="chevron-left" />
        </span>
      </li>

      <li>
        <a
          v-if="hasNext"
          aria-label="次へ"
          :class="{ 'is-active': hasNext }"
          @click.prevent="changePage(currentPage + 1)"
        >
          <FontAwesomeIcon icon="chevron-right" />
        </a>

        <span v-else class="is-disabled">
          <FontAwesomeIcon icon="chevron-right" />
        </span>
      </li>
    </ul>

    <ol class="pagination-list">
      <li v-if="hasFirst">
        <a @click.prevent="changePage(1)">1</a>
      </li>

      <li v-if="hasFirstEllipsis">
        <span class="is-ellipsis">...</span>
      </li>

      <li v-for="page in pages" :key="page">
        <span
          v-if="page === currentPage"
          :class="{ 'is-active': page === currentPage }"
        >
          {{ page }}
        </span>

        <a v-else @click.prevent="changePage(page)">
          {{ page }}
        </a>
      </li>

      <li v-if="hasLastEllipsis">
        <span class="is-ellipsis">...</span>
      </li>

      <li v-if="hasLast">
        <a @click.prevent="changePage(lastPage)">{{ lastPage }}</a>
      </li>
    </ol>

    <div v-if="pages.length > 0" class="pagination-statistics">
      {{ from }} - {{ to }} of {{ total }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'ThePagination',

  props: {
    pagination: {
      type: Object,
      required: true,
      default: () => ({})
    }
  },

  emits: ['update-page'],

  data() {
    return {
      currentPage: this.pagination.current_page
    }
  },

  computed: {
    beforeCurrent() {
      return 1
    },

    afterCurrent() {
      return 1
    },

    lastPage() {
      return this.pagination.last_page
    },

    from() {
      return this.pagination.from
    },

    to() {
      return this.pagination.to
    },

    total() {
      return this.pagination.total
    },

    hasPrevious() {
      return this.currentPage > 1
    },

    hasNext() {
      return this.currentPage < this.lastPage
    },

    hasFirst() {
      return this.currentPage >= 2 + this.beforeCurrent
    },

    hasLast() {
      return this.currentPage <= this.lastPage - (1 + this.afterCurrent)
    },

    hasFirstEllipsis() {
      return this.currentPage >= this.beforeCurrent + 4
    },

    hasLastEllipsis() {
      return this.currentPage < this.lastPage - (2 + this.afterCurrent)
    },

    pages() {
      if (!this.to) return []

      let from = Math.max(1, this.currentPage - this.beforeCurrent)
      if (from - 1 === 2) {
        from--
      }

      let to = Math.min(this.currentPage + this.afterCurrent, this.lastPage)
      if (this.lastPage - to === 2) {
        to++
      }

      let pages = []
      for (let page = from; page <= to; page++) {
        pages.push(page)
      }

      return pages
    }
  },

  watch: {
    // eslint-disable-next-line no-unused-vars
    pagination(value, oldValue) {
      this.currentPage = value.current_page
    },

    currentPage(value, oldValue) {
      if (value === oldValue) return

      this.$router.push(
        {
          query: Object.assign({}, this.$route.query, {
            page: value
          })
        },
        () => {}
      )
    }
  },

  methods: {
    changePage(page) {
      if (page === this.currentPage) return

      this.currentPage = page

      this.$emit('update-page', page)
    }
  }
}
</script>
