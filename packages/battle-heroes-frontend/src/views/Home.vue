<template>
  <TheLayoutGame>
    <div class="view-home">
      <BaseGrid>
        <BaseCard title="PLAYER STATS"> PLAYER STATS </BaseCard>
        <BaseCard title="PLAYER RANKING"> PLAYER RANKING </BaseCard>
        <BaseCard title="PLAYER LIST"> PLAYER LIST </BaseCard>
        <BaseCard title="CURRENT BATTLES"> CURRENT BATTLES </BaseCard>
      </BaseGrid>
    </div>
  </TheLayoutGame>
</template>

<script>
import TheLayoutGame from '@/components/TheLayoutGame'

export default {
  name: 'Home',

  components: {
    TheLayoutGame
  }
}
</script>
