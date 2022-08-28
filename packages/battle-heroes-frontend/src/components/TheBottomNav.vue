<template>
  <nav class="bottom-nav">
    <ul class="bottom-nav-list">
      <router-link
        v-slot="{ isActive, href, navigate }"
        custom
        :to="{ name: 'arena' }"
      >
        <li class="bottom-nav-list-item">
          <a
            class="bottom-nav-list-item-link"
            :class="{ 'is-active': isActive }"
            :href="href"
            @click="navigate"
          >
            <FontAwesomeIcon icon="khanda" />
          </a>
        </li>
      </router-link>
      <router-link
        v-slot="{ isActive, href, navigate }"
        custom
        :to="{ name: 'rankings' }"
      >
        <li class="bottom-nav-list-item">
          <a
            class="bottom-nav-list-item-link"
            :class="{ 'is-active': isActive }"
            :href="href"
            @click="navigate"
          >
            <FontAwesomeIcon icon="ranking-star" />
          </a>
        </li>
      </router-link>
      <router-link
        v-slot="{ isActive, href, navigate }"
        custom
        :to="{ name: 'exchange' }"
      >
        <li class="bottom-nav-list-item">
          <a
            class="bottom-nav-list-item-link"
            :class="{ 'is-active': isActive }"
            :href="href"
            @click="navigate"
          >
            <FontAwesomeIcon icon="store" />
          </a>
        </li>
      </router-link>
      <router-link
        v-slot="{ isActive, href, navigate }"
        custom
        :to="{ name: 'herodex' }"
      >
        <li class="bottom-nav-list-item">
          <a
            class="bottom-nav-list-item-link"
            :class="{ 'is-active': isActive }"
            :href="href"
            @click="navigate"
          >
            <FontAwesomeIcon icon="book-journal-whills" />
          </a>
        </li>
      </router-link>
      <router-link
        v-slot="{ isActive, href, navigate }"
        custom
        :to="{ name: 'account' }"
      >
        <li class="bottom-nav-list-item">
          <a
            class="bottom-nav-list-item-link"
            :class="{ 'is-active': isActive }"
            :href="href"
            @click="navigate"
          >
            <FontAwesomeIcon icon="user" />
          </a>
        </li>
      </router-link>
    </ul>
  </nav>
</template>

<script>
export default {
  name: 'TheBottomNav'
}
</script>
