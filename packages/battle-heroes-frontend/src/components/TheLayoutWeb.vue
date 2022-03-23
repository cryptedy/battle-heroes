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
