<template>
  <BaseButton
    :type="isAudioEnabled ? 'primary' : 'default'"
    @click="toggleAudio"
  >
    <FontAwesomeIcon v-if="isAudioEnabled" icon="volume-high" />
    <FontAwesomeIcon v-else icon="volume-xmark" />
  </BaseButton>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'ToggleAudio',

  computed: {
    ...mapGetters({
      isAudioEnabled: 'audio/isAudioEnabled'
    })
  },

  methods: {
    ...mapActions({
      setAudio: 'audio/setAudio'
    }),

    toggleAudio() {
      const audio = this.isAudioEnabled ? false : true

      this.setAudio(audio)
    }
  }
}
</script>
