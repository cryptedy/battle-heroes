<template>
  <div class="web">
    <header class="web-header" role="banner">
      <TheHeader />
    </header>

    <main class="web-main" role="main">
      <div class="web-main-content">
        <slot />
      </div>
    </main>

    <footer class="web-footer">
      <TheFooter />
    </footer>
  </div>
</template>

<script>
import TheFooter from '@/components/TheFooter'
import TheHeader from '@/components/TheHeader'

export default {
  name: 'TheLayoutWeb',

  components: {
    TheFooter,
    TheHeader
  }
}
</script>
