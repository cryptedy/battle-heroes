<template>
  <p v-if="!connected">
    <BaseSpinner />
    Connecting to server...
  </p>

  <template v-else>
    <div>
      <h4>Online members</h4>

      <span v-for="user in users" :key="user.id" style="margin-right: 8px">
        <img :src="user.image_url" width="32" height="32" />
      </span>
    </div>

    <hr />

    <div>
      <h4>Chat messages</h4>

      <ul>
        <li v-for="({ user, text }, index) in messages" :key="index">
          <span
            v-if="!user.image_url"
            style="
              display: inline-block;
              background-color: gray;
              width: 32px;
              height: 32px;
            "
          ></span>
          <img v-else :src="user.image_url" width="32" height="32" />
          {{ user.name }}
          -
          {{ text }}
        </li>
      </ul>
    </div>

    <form @submit.prevent="sendMessage">
      <input
        ref="input"
        v-model="message"
        v-focus
        placeholder="Send message"
        type="text"
      />
    </form>
  </template>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Chat',

  data() {
    return {
      message: ''
    }
  },

  computed: {
    ...mapGetters({
      user: 'auth/user',
      users: 'chat/users',
      messages: 'chat/messages',
      connected: 'socket/connected',
      currentTransport: 'socket/currentTransport'
    })
  },

  watch: {
    messages: {
      // eslint-disable-next-line no-unused-vars
      handler(value, oldValue) {
        this.$nextTick(() => this.scrollToBottom())
      },
      deep: true
    }
  },

  mounted() {
    this.$socket.connect()
    this.$socket.on('connect', () => this.$socket.emit('chat:join', this.user))

    // TODO: no effect
    this.$nextTick(() => this.scrollToBottom())
  },

  beforeUnmount() {
    this.$socket.off('connect')
  },

  methods: {
    sendMessage() {
      if (!this.connected) alert('Not connected')

      if (this.message.length === 0 || this.message.match('^( |　)+$')) return

      this.$socket.emit('chat:newMessage', this.message)

      this.message = ''
    },

    scrollToBottom() {
      window.scrollTo(
        0,
        document.body.scrollHeight || document.documentElement.scrollHeight
      )
    }
  }
}
</script>
