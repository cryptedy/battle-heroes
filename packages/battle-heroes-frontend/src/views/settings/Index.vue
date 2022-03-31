<template>
  <TheLayoutGame>
    <div class="view-settings">
      <router-view />
    </div>
  </TheLayoutGame>
</template>

<script>
import TheLayoutGame from '@/components/TheLayoutGame'

export default {
  name: 'Settings',

  components: {
    TheLayoutGame
  }
}
</script>
