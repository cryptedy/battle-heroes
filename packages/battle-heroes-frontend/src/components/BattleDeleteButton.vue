<template>
  <BaseButton v-if="canDeleteBattle" type="danger" @click="deleteBattle">
    バトル削除
  </BaseButton>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { NOTIFICATION_TYPE } from '@/utils/constants'

export default {
  name: 'BattleDeleteButton',

  props: {
    battle: {
      type: Object,
      required: true
    }
  },

  computed: {
    ...mapGetters({
      player: 'game/player',
      playerBattle: 'game/playerBattle'
    }),

    isPlayerBattle() {
      return this.playerBattle && this.playerBattle.id === this.battle.id
    },

    canDeleteBattle() {
      return this.playerBattle && this.isPlayerBattle
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
