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
          alt="Opponent Wanted"
          width="64"
          height="64"
        />
        <p>？？？</p>
        <p>挑戦者募集中</p>
      </template>

      <template v-else>
        <img :src="NFT2.image_url" :alt="NFT2.name" width="64" height="64" />
        <p>{{ player2.name }}</p>
        <p>{{ NFT2.name }}</p>

        <HealthBar v-if="game" :max-hp="status2.max_hp" :hp="status2.hp" />
      </template>
    </div>

    <div class="battle-list-item-actions">
      <BattleDeleteButton :battle="battle" />

      <BattleJoinButton :battle="battle" />
    </div>
  </BaseListItem>
</template>

<script>
import { mapGetters } from 'vuex'
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
    },

    games: {
      type: Array,
      required: true
    }
  },

  emits: ['game-load'],

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

    game() {
      return this.games.find(game => game.battle_id === this.battle.id)
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

  methods: {
    onGameLoad({ status, message, game }) {
      console.log('onGameLoad', status, message, game)

      if (status) {
        this.$emit('game-load', game)
      }
    }
  }
}
</script>
