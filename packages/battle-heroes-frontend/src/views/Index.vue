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

    <h2 class="hero-text-primary">Pixel Heroes Game</h2>

    <p class="hero-text-secondary">Prototype version 0.01</p>
    <p class="hero-text-secondary">
      Pixel Heroes シリーズの NFT 同士でバトルができるシンプルなゲームです。
    </p>
    <p>
      <router-link :to="{ name: 'collections' }">
        Pixel Heroes 図鑑
      </router-link>
    </p>

    <LoginButton />

    <p class="online-players-text">
      <span class="online-players-text-count">
        {{ onlinePlayers.length }}
      </span>
      /
      {{ players.length }}

      players are now online.
    </p>

    <p class="hero-text-secondary">🚨 注意 🚨</p>
    <p class="hero-text-secondary">
      現在プロトタイプバージョンのためご利用は自己責任でお願いします。
    </p>
    <p class="hero-text-secondary">
      ログインすると OpenSea
      のユーザ名、アバター画像が他のプレイヤーに表示されます。
    </p>
  </div>
</template>

<script>
import axios from 'axios'
import { API_URL } from '@/utils/constants'
import LoginButton from '@/components/LoginButton'

export default {
  name: 'IndexView',

  components: {
    LoginButton
  },

  data() {
    return {
      players: []
    }
  },

  computed: {
    onlinePlayers() {
      return this.players.filter(player => player.socket_ids.length > 0)
    }
  },

  async created() {
    await this.getPlayers()
  },

  methods: {
    async getPlayers() {
      try {
        const { data: players } = await axios.get(`${API_URL}/players`)

        this.players = players
      } catch (error) {
        console.log(error)
      }
    }
  }
}
</script>
