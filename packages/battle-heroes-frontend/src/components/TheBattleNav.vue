<template>
  <BaseDialog :open="dialogShown" @close="dialogShown = false">
    <SelectNFTs :player="player" @select="onSelectNFT" />
  </BaseDialog>

  <BaseButton
    v-if="!playerBattle && player.state === PLAYER_STATE.IDLE"
    @click="randomBattle"
  >
    RANDOM BATTLE
  </BaseButton>

  <BaseButton
    v-if="!playerBattle && player.state === PLAYER_STATE.IDLE"
    @click="createBattle"
  >
    CREATE BATTLE
  </BaseButton>

  <BaseButton
    v-if="playerBattle && player.state !== PLAYER_STATE.BATTLE"
    @click="deleteBattle"
  >
    DELETE BATTLE
  </BaseButton>
  <BaseButton v-else-if="player.state === PLAYER_STATE.STANDBY">
    IDLE
  </BaseButton>

  <div v-if="playerBattle">
    <p>Standby Hero: {{ playerBattle.player.NFT.name }}</p>

    <img
      :src="playerBattle.player.NFT.image_url"
      :alt="playerBattle.player.NFT.name"
      width="128"
      height="128"
    />
  </div>

  <hr />
</template>

<script>
import { mapGetters } from 'vuex'
import { PLAYER_STATE } from '@/utils/constants'
import SelectNFTs from '@/components/SelectNFTs'

export default {
  name: 'TheBattleNav',

  components: {
    SelectNFTs
  },

  props: {
    player: {
      type: Object,
      required: true
    }
  },

  data() {
    return {
      dialogShown: false
    }
  },

  computed: {
    ...mapGetters({
      playerBattle: 'game/battle'
    }),

    PLAYER_STATE() {
      return PLAYER_STATE
    }
  },

  methods: {
    onSelectNFT(NFT) {
      this.dialogShown = false

      this.$socket.emit('battle:create', NFT)
    },

    randomBattle() {
      this.$socket.emit('battle:random', {})
    },

    createBattle() {
      this.dialogShown = true
    },

    deleteBattle() {
      this.$socket.emit('battle:delete')
    }
  }
}
</script>
