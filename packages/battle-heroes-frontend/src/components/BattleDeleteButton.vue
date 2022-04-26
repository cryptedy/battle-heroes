<template>
  <BaseButton v-if="canDeleteBattle" type="danger" @click="deleteBattle">
    DELETE
  </BaseButton>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { NOTIFICATION_TYPE } from '@/utils/constants'

export default {
  name: 'BattleDeleteButton',

  computed: {
    ...mapGetters({
      player: 'game/player',
      playerBattle: 'game/playerBattle'
    }),

    canDeleteBattle() {
      return this.playerBattle
    }
  },

  methods: {
    ...mapActions({
      addNotification: 'notification/add'
    }),

    deleteBattle() {
      this.$socket.emit(
        'battle:delete',
        this.playerBattle.id,
        ({ status, message }) => {
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
        }
      )
    }
  }
}
</script>
