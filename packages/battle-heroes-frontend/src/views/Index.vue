<template>
  <div id="header">
    <TheHeader />
  </div>

  <div id="main">
    <TheMain>
      <div id="hero">
        <TheHero />
      </div>
    </TheMain>
  </div>
</template>

<script>
import TheHero from '@/components/TheHero'
import TheMain from '@/components/TheMain'
import TheHeader from '@/components/TheHeader'

export default {
  name: 'Index',

  components: {
    TheHero,
    TheMain,
    TheHeader
  }
}
</script>
