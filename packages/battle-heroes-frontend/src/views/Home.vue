<template>
  <LayoutHome>
    <div class="hero-section">
      <div class="hero">
        <p class="hero-image">
          <img src="@/assets/images/brand-logo.png" alt="Battle Heroes" />
        </p>

        <h2 class="hero-text-primary">A Pixel Heroes Game</h2>

        <p class="hero-text-secondary">Prototype version 0.01</p>

        <LoginButton />

        <p class="online-players-text">
          <span class="online-players-text-count">xxx</span>
          players are now online.
        </p>
      </div>
    </div>
  </LayoutHome>
</template>

<script>
import LayoutHome from '@/components/LayoutHome'
import LoginButton from '@/components/LoginButton'

export default {
  name: 'Home',

  components: {
    LayoutHome,
    LoginButton
  }
}
</script>
