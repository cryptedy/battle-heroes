<template>
  <div class="player-stats">
    <ul class="player-stats-list">
      <li class="player-stats-list-item">
        <span class="player-stats-list-item-text"> EXP {{ player.exp }} </span>
      </li>
      <li class="player-stats-list-item">
        <span class="player-stats-list-item-text"> WIN {{ player.win }} </span>
      </li>
      <li class="player-stats-list-item">
        <span class="player-stats-list-item-text">
          LOSE {{ player.lose }}
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
