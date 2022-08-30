<template>
  <BaseButton type="primary" :disabled="loading" @click="renewPlayer">
    <BaseSpinner v-if="loading" />

    プレイヤー情報を更新
  </BaseButton>
</template>

<script>
import { mapActions } from 'vuex'
import { NOTIFICATION_TYPE } from '@/utils/constants'

export default {
  name: 'PlayerRenewButton',

  data() {
    return {
      loading: false
    }
  },

  methods: {
    ...mapActions({
      updatePlayer: 'player/update',
      addNotification: 'notification/add'
    }),

    renewPlayer() {
      this.loading = true

      this.$socket.emit('player:renew', ({ status, message, player }) => {
        console.log('player:renewed', status, message, player)

        if (status) {
          this.updatePlayer(player)

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
