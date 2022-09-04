<template>
  <BaseButton
    v-if="canDeleteBattle"
    type="danger"
    :disabled="loading"
    @click="execute"
  >
    {{ label }}
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

  emits: ['deleted'],

  data() {
    return {
      loading: false
    }
  },

  computed: {
    ...mapGetters({
      player: 'game/player',
      playerBattle: 'game/playerBattle',
      hasInvitation: 'game/hasInvitation'
    }),

    isPlayerBattle() {
      return this.playerBattle && this.playerBattle.id === this.battle.id
    },

    canDeleteBattle() {
      return this.playerBattle && this.isPlayerBattle
    },

    label() {
      return this.hasInvitation ? 'バトルを辞退' : 'バトルを中止'
    }
  },

  methods: {
    ...mapActions({
      deleteBattle: 'battle/delete',
      addNotification: 'notification/add'
    }),

    async execute() {
      this.loading = true

      this.deleteBattle(this.playerBattle.id)
        // eslint-disable-next-line no-unused-vars
        .then(({ status, message, battleId }) => {
          this.$emit('deleted', battleId)
        })
        .catch(error => {
          this.addNotification({
            message: error.message,
            type: NOTIFICATION_TYPE.ERROR,
            timeout: 0
          })
        })
        .finally(() => {
          this.loading = false
        })
    }
  }
}
</script>
