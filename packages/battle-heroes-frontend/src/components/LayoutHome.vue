<template>
  <div class="header-section">
    <header class="header">
      <h1 class="brand-text">
        <router-link :to="{ name: 'home' }"> Battle Heroes </router-link>
      </h1>

      <p class="login-text">
        <router-link :to="{ name: 'login' }"> LOGIN </router-link>
      </p>
    </header>
  </div>

  <div class="main-section">
    <slot />
  </div>
</template>

<script>
export default {
  name: 'LayoutHome'
}
</script>

<style lang="scss">
.header-section {
  width: 100%;
  height: 70px;

  background-color: palette(grey, 800);
  border-bottom: 1px solid color(divider, light);
}

.main-section {
  width: 100%;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  max-width: 1065px;
  height: 100%;
  margin: 0 auto;
  padding: 0 32px;

  .brand-text {
    font-size: 20px;
    color: color(primary, light);

    > a {
      color: inherit;
    }
  }

  .login-text {
    color: color(primary, light);

    > a {
      color: inherit;
    }
  }
}

.hero-section {
  display: flex;
  align-items: center;
  min-height: calc(100vh - 70px);
  max-height: 1080px;
  padding: 24px 0;

  .hero {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    margin: 12px auto;
    padding: 24px 12px;
    text-align: center;

    &-image {
      max-width: 360px;
      max-height: 182px;
      margin: 32px;

      > img {
        width: 100%;
      }
    }

    &-text {
      word-break: break-all;

      &-primary {
        margin-bottom: 8px;
        font-size: 32px;
        line-height: line-height(32px, 24px);
        color: color(primary, light);
      }

      &-secondary {
        color: color(secondary, light);
      }
    }

    .online-players-text {
      color: color(secondary, light);

      &-count {
        font-weight: bold;
        color: palette(green, 500);
      }
    }
  }
}
</style>
