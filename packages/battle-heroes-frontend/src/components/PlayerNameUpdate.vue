<template>
  <form class="form" @submit.prevent="UpdatePlayer">
    <input id="battle-name" v-model="name" v-focus class="input" type="text" />
    <BaseButton type="primary" :disabled="loading">
      <BaseSpinner v-if="loading" />

      更新
    </BaseButton>
  </form>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { NOTIFICATION_TYPE } from '@/utils/constants'

export default {
  name: 'PlayerNameUpdate',

  emits: ['update'],

  data() {
    return {
      loading: false,
      name: ''
    }
  },

  computed: {
    ...mapGetters({
      player: 'game/player'
    })
  },

  beforeMount() {
    this.name = this.player.name
  },

  methods: {
    ...mapActions({
      updatePlayer: 'player/update',
      addNotification: 'notification/add'
    }),

    UpdatePlayer() {
      console.log('UpdatePlayer', this.name)

      if (this.name === '') return

      this.loading = true

      this.$socket.emit(
        'player:update',
        {
          name: this.name
        },
        ({ status, message, player }) => {
          console.log('player:updated', status, message, player)

          if (status) {
            this.updatePlayer(player)

            this.addNotification({
              message,
              type: NOTIFICATION_TYPE.SUCCESS
            })

            this.$emit('update')
          } else {
            this.addNotification({
              message,
              type: NOTIFICATION_TYPE.ERROR,
              timeout: 0
            })
          }

          this.loading = false
        }
      )
    }
  }
}
</script>
