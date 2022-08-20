<template>
  <div class="player-stats">
    <ul class="player-stats-list">
      <li class="player-stats-list-item">
        <span class="player-stats-list-item-text">
          経験値 {{ player.exp }}
        </span>
      </li>
      <li class="player-stats-list-item">
        <span class="player-stats-list-item-text"> 勝ち {{ player.win }} </span>
      </li>
      <li class="player-stats-list-item">
        <span class="player-stats-list-item-text">
          負け {{ player.lose }}
        </span>
      </li>
      <li class="player-stats-list-item">
        <span class="player-stats-list-item-icon">
          <FontAwesomeIcon icon="layer-group" />
        </span>
        <span class="player-stats-list-item-text">
          {{ player.nft_ids.length }}
        </span>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'PlayerStats',

  props: {
    player: {
      type: Object,
      required: true
    }
  }
}
</script>
