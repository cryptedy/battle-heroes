<template>
  <div class="hero">
    <p class="hero-image">
      <img
        src="@/assets/images/brand-logo.png"
        alt="Battle Heroes"
        width="360"
        height="182"
      />
    </p>

    <h2 class="hero-text-primary">A Pixel Heroes Game</h2>

    <p class="hero-text-secondary">Prototype version 0.01</p>

    <LoginButton />

    <p class="online-players-text">
      <span class="online-players-text-count">
        {{ onlinePlayers.length }}
      </span>
      /
      {{ players.length }}

      players are now online.
    </p>
  </div>
</template>

<script>
import axios from 'axios'
import { mapGetters, mapActions } from 'vuex'
import { API_URL } from '@/utils/constants'
import LoginButton from '@/components/LoginButton'

export default {
  name: 'TheHero',

  components: {
    LoginButton
  },

  computed: {
    ...mapGetters({
      players: 'player/all'
    }),

    onlinePlayers() {
      return this.players.filter(player => player.socket_ids.length > 0)
    }
  },

  async created() {
    await this.getPlayers()
  },

  async mounted() {
    this.$socket.on('player:players', players => this.setPlayers(players))
    this.$socket.on('player:player', player => this.addPlayers(player))
    this.$socket.on('player:update', player => this.updatePlayers(player))
  },

  async beforeUnmount() {
    this.$socket.off('player:players')
    this.$socket.off('player:player')
    this.$socket.off('player:update')

    await this.deletePlayers()
  },

  methods: {
    ...mapActions({
      addPlayers: 'player/add',
      setPlayers: 'player/set',
      updatePlayers: 'player/update',
      deletePlayers: 'player/delete'
    }),

    async getPlayers() {
      try {
        const { data: players } = await axios.get(`${API_URL}/players`)

        this.setPlayers(players)
      } catch (error) {
        console.log(error)
      }
    }
  }
}
</script>
