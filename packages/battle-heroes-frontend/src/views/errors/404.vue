<template>
  <ErrorScreen message="404 Not Found">
    <BaseButton type="primary" @click="goHome">
      <FontAwesomeIcon icon="arrow-left" />
      戻る
    </BaseButton>
  </ErrorScreen>
</template>

<script>
import { mapGetters } from 'vuex'
import ErrorScreen from '@/components/ErrorScreen'

export default {
  name: 'LoginView',

  components: {
    ErrorScreen
  },

  computed: {
    ...mapGetters({
      isLogin: 'auth/isLogin'
    })
  },

  methods: {
    goHome() {
      return this.$router.push(
        {
          name: this.isLogin ? 'arena' : 'login'
        },
        () => {}
      )
    }
  }
}
</script>
