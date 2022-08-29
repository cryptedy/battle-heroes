<template>
  <div class="web">
    <header class="web-header" role="banner">
      <TheHeader />
    </header>

    <main class="web-main" role="main">
      <section class="section">
        <slot />
      </section>
    </main>

    <footer class="web-footer">
      <TheFooter />
    </footer>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import TheFooter from '@/components/TheFooter'
import TheHeader from '@/components/TheHeader'
import { MUSIC } from '@/utils/constants'

export default {
  name: 'WebLayout',

  components: {
    TheFooter,
    TheHeader
  },

  mounted() {
    this.playAudio(MUSIC.OPENING)
  },

  beforeUnmount() {
    this.stopAudio(MUSIC.OPENING)
  },

  methods: {
    ...mapActions({
      playAudio: 'audio/play',
      stopAudio: 'audio/stop'
    })
  }
}
</script>
