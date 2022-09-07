<template>
  <div class="link">
    <ul class="link-list">
      <li class="link-list-item is-microblog">
        <a
          href="https://www.pixelheroes-dao.com/battleheroes/#index_id4"
          target="_blank"
        >
          <FontAwesomeIcon :icon="['fab', 'microblog']" />

          遊び方
        </a>
      </li>
      <li class="link-list-item is-twitter">
        <a href="https://twitter.com/pixelheroesgame" target="_blank">
          <FontAwesomeIcon :icon="['fab', 'twitter']" />

          Twitter
        </a>
      </li>
      <li class="link-list-item is-youtube">
        <a
          href="https://www.youtube.com/channel/UCOnNbVJuQePN6qWTNuPsQ3A"
          target="_blank"
        >
          <FontAwesomeIcon :icon="['fab', 'youtube']" />

          YouTube
        </a>
      </li>
      <li class="link-list-item is-discord">
        <a href="https://discord.gg/AmwXN968" target="_blank">
          <FontAwesomeIcon :icon="['fab', 'discord']" />

          Discord
        </a>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'Links'
}
</script>
