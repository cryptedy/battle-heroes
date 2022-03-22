<template>
  <TheLayout>
    <h1>BATTLES</h1>

    <p v-if="!battles.length > 0">No battles.</p>

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
  </TheLayout>
</template>

<script>
import { mapGetters } from 'vuex'
import TheLayout from '@/components/TheLayout'

export default {
  name: 'Battles',

  components: {
    TheLayout
  },

  computed: {
    ...mapGetters({
      battles: 'battle/all',
      findPlayer: 'player/find'
    })
  }
}
</script>
