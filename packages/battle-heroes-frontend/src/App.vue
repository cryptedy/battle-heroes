<template>
  <h1>{{ appTitle }}</h1>

  <div v-if="appIinitializeError">An error occured.</div>

  <div v-else-if="!appInitialized">
    <Spinner />
    Launching your app...
  </div>

  <div v-else>
    <router-view />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Spinner from '@/components/Spinner'

const appTitle = process.env.VUE_APP_TITLE

export default {
  components: {
    Spinner
  },

  data() {
    return {
      appTitle: appTitle
    }
  },

  computed: {
    ...mapGetters({
      appInitialized: 'app/initialized',
      appIinitializeError: 'app/initializeError'
    })
  }
}
</script>
