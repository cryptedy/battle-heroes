<template>
  <TheLayout>
    <h1>SETTINGS</h1>

    <router-view />
  </TheLayout>
</template>

<script>
import TheLayout from '@/components/TheLayout'

export default {
  name: 'Settings',

  components: {
    TheLayout
  }
}
</script>
