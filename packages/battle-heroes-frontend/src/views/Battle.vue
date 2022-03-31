<template>
  <div class="battle">
    <div class="battle-ground">
      <div class="battle-ground-player is-opponent">
        <div class="battle-ground-player-name">PLAYER NAME</div>

        <div class="battle-ground-nft">
          <div class="battle-ground-nft-name">NFT NAME</div>
          <div class="battle-ground-nft-image">
            <img
              src="@/assets/images/blank-NFT.png"
              alt=""
              width="512"
              height="512"
            />
          </div>
          <div class="battle-health-bar">[ HEALTH BAR ]</div>
          <div class="battle-ground-nft-attributes">NFT ATTRIBUTES</div>
        </div>
      </div>

      <div class="battle-ground-player">
        <div class="battle-ground-player-name">PLAYER NAME</div>

        <div class="battle-ground-nft">
          <div class="battle-ground-nft-name">NFT NAME</div>
          <div class="battle-ground-nft-image">
            <img
              src="@/assets/images/blank-NFT.png"
              alt=""
              width="512"
              height="512"
            />
          </div>
          <div class="battle-health-bar">[ HEALTH BAR ]</div>
          <div class="battle-ground-nft-attributes">NFT ATTRIBUTES</div>
        </div>
      </div>
    </div>

    <div class="battle-messages">
      <ul>
        <li v-for="index in 100" :key="index">BATTLE MESSAGE #{{ index }}</li>
      </ul>
    </div>

    <div class="battle-controls">
      <ul>
        <li>ATTACK</li>
        <li>SPELL</li>
        <li>DEFFENCE</li>
        <li>RUN</li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Battle'
}
</script>
