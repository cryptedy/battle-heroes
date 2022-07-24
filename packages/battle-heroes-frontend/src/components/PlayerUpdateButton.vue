<template>
  <BaseButton type="primary" @click="updatePlayer">
    <BaseSpinner v-if="loading" />

    プレイヤー情報を更新
  </BaseButton>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { NOTIFICATION_TYPE } from '@/utils/constants'

export default {
  name: 'PlayerUpdateButton',

  data() {
    return {
      loading: false
    }
  },

  computed: {
    ...mapGetters({
      user: 'auth/user',
      player: 'game/player',
      playerNFT: 'battle/playerNFT',
      playerBattle: 'game/playerBattle'
    })
  },

  methods: {
    ...mapActions({
      addNotification: 'notification/add'
    }),

    updatePlayer() {
      this.loading = true

      this.$socket.emit('player:update', this.user, ({ status, message }) => {
        console.log('player:update', status)

        if (status) {
          this.addNotification({
            message,
            type: NOTIFICATION_TYPE.SUCCESS
          })
        } else {
          this.addNotification({
            message,
            type: NOTIFICATION_TYPE.ERROR,
            timeout: 0
          })
        }

        this.loading = false
      })
    }
  }
}
</script>
