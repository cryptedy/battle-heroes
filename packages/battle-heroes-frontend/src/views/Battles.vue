<template>
  <TheLayoutGame>
    <BaseEmpty v-if="!battles.length > 0" />

    <BaseList v-else>
      <BaseListItem v-for="battle in battles" :key="battle.id">
        <p>
          {{ findPlayer(battle.player.id).name }}
          <span> VS </span>

          <template v-if="battle.opponent_player.id">
            {{ findPlayer(battle.opponent_player.id).name }}
          </template>
          <template v-else>
            <BaseButton> BATTLE NOW! </BaseButton>
          </template>
        </p>
        <hr />
      </BaseListItem>
    </BaseList>
  </TheLayoutGame>
</template>

<script>
import { mapGetters } from 'vuex'
import TheLayoutGame from '@/components/TheLayoutGame'

export default {
  name: 'Battles',

  components: {
    TheLayoutGame
  },

  computed: {
    ...mapGetters({
      battles: 'battle/all',
      findPlayer: 'player/find'
    })
  }
}
</script>
