<template>
  <LayoutMain>
    <p v-if="!players.length > 0">No players.</p>

    <BaseList v-else>
      <BaseListItem v-for="player in players" :key="player.id">
        <Player :player="player" />
      </BaseListItem>
    </BaseList>
  </LayoutMain>
</template>

<script>
import { mapGetters } from 'vuex'
import Player from '@/components/Player'
import LayoutMain from '@/components/LayoutMain'

export default {
  name: 'Players',

  components: {
    Player,
    LayoutMain
  },

  data() {
    return {
      drawerShown: false,
      dialogShown: false
    }
  },

  computed: {
    ...mapGetters({
      players: 'player/all'
    })
  }
}
</script>
