<template>
  <BaseListItem class="battle-list-item">
    <div class="battle-list-item-primary">
      <img :src="NFT1.image_url" :alt="NFT1.name" width="64" height="64" />
      <p>{{ player1.name }}</p>
      <p>{{ NFT1.name }}</p>

      <HealthBar v-if="game" :max-hp="status1.max_hp" :hp="status1.hp" />
    </div>

    <div class="battle-list-item-secondary">
      <template v-if="!player2">
        <img
          src="@/assets/images/blank-NFT.png"
          alt="OPPONENT WANTED"
          width="64"
          height="64"
        />
        <p>OPPONENT WANTED</p>
      </template>

      <template v-else>
        <img :src="NFT2.image_url" :alt="NFT2.name" width="64" height="64" />
        <p>{{ player2.name }}</p>
        <p>{{ NFT2.name }}</p>

        <HealthBar v-if="game" :max-hp="status2.max_hp" :hp="status2.hp" />
      </template>
    </div>

    <div class="battle-list-item-actions">
      <BattleDeleteButton />

      <BattleJoinButton :battle="battle" />
    </div>
  </BaseListItem>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import HealthBar from '@/components/HealthBar'
import BattleJoinButton from '@/components/BattleJoinButton'
import BattleDeleteButton from '@/components/BattleDeleteButton'

export default {
  name: 'BattleListItem',

  components: {
    HealthBar,
    BattleJoinButton,
    BattleDeleteButton
  },

  props: {
    battle: {
      type: Object,
      required: true
    }
  },

  data() {
    return {
      game: null
    }
  },

  computed: {
    ...mapGetters({
      findNFT: 'NFT/find',
      player: 'game/player',
      findPlayer: 'player/find',
      playerBattle: 'game/playerBattle'
    }),

    player1() {
      return this.findPlayer(this.battle.players[1].id)
    },

    player2() {
      return this.findPlayer(this.battle.players[2].id)
    },

    NFT1() {
      return this.findNFT(this.battle.players[1].NFT_id)
    },

    NFT2() {
      return this.findNFT(this.battle.players[2].NFT_id)
    },

    status1() {
      return this.game.players[1]
    },

    status2() {
      return this.game.players[2]
    }
  },

  mounted() {
    this.$socket.emit('game:load', this.battle.id, this.onGameLoad)
  },

  beforeUnmount() {
    this.$socket.off('game:update')
  },

  methods: {
    ...mapActions({
      addNotification: 'notification/add'
    }),

    onGameLoad({ status, message, game }) {
      console.log('onGameLoad', status, message, game)

      if (status) {
        this.game = game

        this.$socket.on('game:update', this.onGameUpdate)
      }
    },

    onGameUpdate(game) {
      console.log('onGameUpdate', game)

      if (this.game.id === game.id) {
        this.game = game
      }
    }
  }
}
</script>
