<template>
  <TheLayoutGame>
    <h1>SETTINGS</h1>

    <router-view />
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
