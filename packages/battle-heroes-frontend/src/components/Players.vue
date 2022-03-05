<template>
  <ul>
    <li v-for="user in users" :key="user.id" style="margin-right: 8px">
      <img :src="user.image_url" width="32" height="32" />
      {{ user.name }}
      <hr />
    </li>
  </ul>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Players',

  computed: {
    ...mapGetters({
      users: 'chat/users'
    })
  }
}
</script>
