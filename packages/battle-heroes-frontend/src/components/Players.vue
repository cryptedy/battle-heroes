<template>
  <ul>
    <li v-for="player in players" :key="player.id" style="margin-right: 8px">
      <BasePlayerAvatar :player="player" />

      {{ player.name }}
      -
      <span
        v-if="player.socket_ids.length > 0"
        style="font-weight: bold; color: green"
      >
        ONLINE
      </span>
      <span v-else style="font-weight: bold; color: grey"> OFFLINE </span>
      - Lv.
      {{ player.level }}
      -
      {{ $filters.playerState(player.state) }}

      <base-accordion :open="false">
        <template #trigger="scopeProps">
          <a style="color: blue; cursor: pointer">
            <span v-if="scopeProps.show">▼</span>
            <span v-else>▶</span>
            Heroes ({{
              player.token_ids[1].length + player.token_ids[2].length
            }})
          </a>
        </template>
        <template #contents>
          <PlayerNFTs :player="player" />
        </template>
      </base-accordion>
      <hr />
    </li>
  </ul>
</template>

<script>
import { mapGetters } from 'vuex'
import PlayerNFTs from '@/components/PlayerNFTs'

export default {
  name: 'Players',

  components: {
    PlayerNFTs
  },

  computed: {
    ...mapGetters({
      players: 'player/all'
    })
  }
}
</script>
