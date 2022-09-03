<template>
  <div class="hero">
    <p class="hero-image">
      <img
        src="@/assets/images/brand-logo.png"
        alt="Battle Heroes"
        width="360"
        height="182"
      />
    </p>

    <h2 class="hero-text-primary">Pixel Heroes Game</h2>

    <p class="hero-text-secondary">Prototype version 0.01</p>
    <p class="hero-text-secondary">
      Pixel Heroes シリーズの NFT 同士でバトルができるシンプルなゲームです。
    </p>
    <p>
      <router-link :to="{ name: 'collections' }">
        Pixel Heroes 図鑑
      </router-link>
    </p>

    <LoginButton />

    <p class="hero-text-secondary">🚨 注意 🚨</p>
    <p class="hero-text-secondary">
      現在プロトタイプバージョンのためご利用は自己責任でお願いします。
    </p>
    <p class="hero-text-secondary">
      ログインすると OpenSea
      のユーザ名、アバター画像が他のプレイヤーに表示されます。
    </p>
  </div>
</template>

<script>
import LoginButton from '@/components/LoginButton'

export default {
  name: 'LoginView',

  components: {
    LoginButton
  }
}
</script>
