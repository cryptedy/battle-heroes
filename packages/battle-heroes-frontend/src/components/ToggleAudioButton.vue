<template>
  <BaseButton
    class="toggle-audio"
    :type="isAudioEnabled ? 'primary' : 'default'"
    @click="toggleAudioButton"
  >
    <FontAwesomeIcon v-if="isAudioEnabled" icon="volume-high" />
    <FontAwesomeIcon v-else icon="volume-xmark" />
  </BaseButton>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'ToggleAudioButton',

  computed: {
    ...mapGetters({
      isAudioEnabled: 'audio/isAudioEnabled'
    })
  },

  methods: {
    ...mapActions({
      setAudio: 'audio/setAudio'
    }),

    toggleAudioButton() {
      const audio = this.isAudioEnabled ? false : true

      this.setAudio(audio)
    }
  }
}
</script>
