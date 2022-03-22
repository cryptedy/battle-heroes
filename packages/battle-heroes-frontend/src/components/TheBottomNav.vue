<template>
  <nav class="bottom-nav">
    <ul class="bottom-nav-list">
      <router-link
        v-slot="{ isActive, href, navigate }"
        custom
        :to="{ name: 'home' }"
      >
        <li class="bottom-nav-list-item" :class="{ 'is-active': isActive }">
          <a :href="href" @click="navigate">
            <FontAwesomeIcon icon="house" size="2x" />
          </a>
        </li>
      </router-link>
      <router-link
        v-slot="{ isActive, href, navigate }"
        custom
        :to="{ name: 'battles' }"
      >
        <li class="bottom-nav-list-item" :class="{ 'is-active': isActive }">
          <a :href="href" @click="navigate">
            <FontAwesomeIcon icon="fire" size="2x" />
          </a>
        </li>
      </router-link>
      <router-link
        v-slot="{ isActive, href, navigate }"
        custom
        :to="{ name: 'players' }"
      >
        <li class="bottom-nav-list-item" :class="{ 'is-active': isActive }">
          <a :href="href" @click="navigate">
            <FontAwesomeIcon icon="users" size="2x" />
          </a>
        </li>
      </router-link>
      <router-link
        v-slot="{ isActive, href, navigate }"
        custom
        :to="{ name: 'messages' }"
      >
        <li class="bottom-nav-list-item" :class="{ 'is-active': isActive }">
          <a :href="href" @click="navigate">
            <FontAwesomeIcon icon="message" size="2x" />
          </a>
        </li>
      </router-link>
      <li class="bottom-nav-list-item">
        <router-link
          v-slot="{ isActive, href, navigate }"
          custom
          :to="{ name: 'settings.account' }"
        >
          <li class="bottom-nav-list-item" :class="{ 'is-active': isActive }">
            <a :href="href" @click="navigate">
              <FontAwesomeIcon icon="user" size="2x" />
            </a>
          </li>
        </router-link>
      </li>
    </ul>
  </nav>
</template>

<script>
export default {
  name: 'TheBottomNav'
}
</script>
