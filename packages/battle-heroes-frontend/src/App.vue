<template>
  <BaseGrid>
    <BaseGridRow>
      <BaseGridColumn v-if="!initialized">
        <BaseSpinner />
        Launching your app...
      </BaseGridColumn>

      <template v-else>
        <BaseGridColumn>
          <AppHeader />
        </BaseGridColumn>

        <BaseGridColumn>
          <RouterView />
        </BaseGridColumn>
      </template>
    </BaseGridRow>
  </BaseGrid>
</template>

<script>
import { mapGetters } from 'vuex'
import AppHeader from '@/components/AppHeader'

const appTitle = process.env.VUE_APP_TITLE

export default {
  name: 'App',

  components: {
    AppHeader
  },

  data() {
    return {
      appTitle: appTitle
    }
  },

  computed: {
    ...mapGetters({
      initialized: 'app/initialized'
    })
  }
}
</script>
