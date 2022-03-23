<template>
  <TheLayoutWeb>
    <TheHero />
  </TheLayoutWeb>
</template>

<script>
import TheHero from '@/components/TheHero'
import TheLayoutWeb from '@/components/TheLayoutWeb'

export default {
  name: 'Index',

  components: {
    TheHero,
    TheLayoutWeb
  }
}
</script>
