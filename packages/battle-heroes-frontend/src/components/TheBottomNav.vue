<template>
  <nav class="bottom-nav">
    <ul class="bottom-nav-list">
      <router-link
        v-slot="{ isActive, href, navigate }"
        custom
        :to="{ name: 'home' }"
      >
        <li class="bottom-nav-list-item">
          <a
            class="bottom-nav-list-item-link"
            :class="{ 'is-active': isActive }"
            :href="href"
            @click="navigate"
          >
            <FontAwesomeIcon icon="house" />
          </a>
        </li>
      </router-link>
      <router-link
        v-slot="{ isActive, href, navigate }"
        custom
        :to="{ name: 'battles' }"
      >
        <li class="bottom-nav-list-item">
          <a
            class="bottom-nav-list-item-link"
            :class="{ 'is-active': isActive }"
            :href="href"
            @click="navigate"
          >
            <FontAwesomeIcon icon="fire" />
          </a>
        </li>
      </router-link>
      <router-link
        v-slot="{ isActive, href, navigate }"
        custom
        :to="{ name: 'players' }"
      >
        <li class="bottom-nav-list-item">
          <a
            class="bottom-nav-list-item-link"
            :class="{ 'is-active': isActive }"
            :href="href"
            @click="navigate"
          >
            <FontAwesomeIcon icon="users" />
          </a>
        </li>
      </router-link>
      <router-link
        v-slot="{ isActive, href, navigate }"
        custom
        :to="{ name: 'messages' }"
      >
        <li class="bottom-nav-list-item">
          <a
            class="bottom-nav-list-item-link"
            :class="{ 'is-active': isActive }"
            :href="href"
            @click="navigate"
          >
            <FontAwesomeIcon icon="message" />
          </a>
        </li>
      </router-link>
      <router-link
        v-slot="{ isActive, href, navigate }"
        custom
        :to="{ name: 'settings.account' }"
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
