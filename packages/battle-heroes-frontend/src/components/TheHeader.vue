<template>
  <div class="header">
    <h1 class="brand-text">
      <router-link :to="{ name: 'index' }"> Battle Heroes </router-link>
    </h1>

    <ToggleAudioButton />
  </div>
</template>

<script>
import ToggleAudioButton from '@/components/ToggleAudioButton'

export default {
  name: 'TheHeader',

  components: {
    ToggleAudioButton
  }
}
</script>
