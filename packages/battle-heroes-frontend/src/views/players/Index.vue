<template>
  <LayoutMain>
    <p v-if="!players.length > 0">No players.</p>
    <ul v-else>
      <li v-for="player in players" :key="player.id">
        <hr />

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

        <BaseDialog>
          <template #trigger>
            <span style="color: blue; cursor: pointer">
              Heroes ({{
                player.token_ids[1].length + player.token_ids[2].length
              }})
            </span>
          </template>

          <BaseGrid>
            <BaseGridRow>
              <BaseGridColumn>
                <BasePlayerAvatar :player="player" />

                <p>
                  <strong>{{ player.name }} heroes</strong>
                </p>

                <hr />

                <PlayerNFTs :player="player" />
              </BaseGridColumn>
            </BaseGridRow>
          </BaseGrid>
        </BaseDialog>
      </li>
    </ul>
  </LayoutMain>
</template>

<script>
import { mapGetters } from 'vuex'
import PlayerNFTs from '@/components/PlayerNFTs'
import LayoutMain from '@/components/LayoutMain'

export default {
  name: 'Players',

  components: {
    PlayerNFTs,
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
