<template>
  <div v-if="!initialized">
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
      initialized: 'app/initialized'
    })
  }
}
</script>
