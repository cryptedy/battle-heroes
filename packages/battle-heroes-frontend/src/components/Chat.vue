<template>
  <div>
    <h4>Online members</h4>
    <span v-for="user in users" :key="user.id" style="margin-left: 8px">
      <img :src="user.image_url" width="32" height="32" />
    </span>
  </div>

  <div>
    <h4>Chat logs</h4>

    <p v-if="currentTransport === 'polling'">Connecting server</p>

    <ul v-else-if="currentTransport === 'websocket'" ref="messages">
      <li v-for="({ user, message }, index) in messages" :key="index">
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
        {{ message }}
      </li>
    </ul>

    <p v-else>Failed to connect to the server</p>
  </div>

  <form @submit.prevent="sendChatMessage">
    <input
      ref="input"
      v-model="chatMessage"
      v-focus
      placeholder="Send message"
      type="text"
    />
  </form>
</template>

<script>
import io from 'socket.io-client'
import { mapGetters } from 'vuex'
import { BACKEND_URL } from '@/utils/constants'

const socket = io(BACKEND_URL, {
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  reconnectionAttempts: 5
})

export default {
  name: 'Chat',

  emits: ['message'],

  data() {
    return {
      connected: socket.connected,
      currentTransport: socket.connected
        ? socket.io.engine.transport.name
        : '-',

      messages: [],
      chatMessage: '',

      users: []
    }
  },

  computed: {
    ...mapGetters({
      user: 'auth/user'
    })
  },

  activated() {
    this.$refs.input.focus()

    // TODO: no effect
    this.$nextTick(() => this.scrollToBottom())
  },

  mounted() {
    socket.on('connect', () => this.onConnectionStateUpdate())
    socket.on('disconnect', () => this.onConnectionStateUpdate())
    socket.on('message', content => this.onMessage(content))

    socket.on('connect', () => {
      socket.emit('join', this.user)
    })

    socket.on('users', users => {
      this.users = users
    })
  },

  beforeUnmount() {
    socket.off('connect')
    socket.off('disconnect')
    socket.off('message')
    socket.off('users')
  },

  methods: {
    onConnectionStateUpdate() {
      this.connected = socket.connected
      this.currentTransport = socket.connected
        ? socket.io.engine.transport.name
        : '-'

      if (socket.connected) {
        socket.io.engine.on('upgrade', () => this.onUpgrade())
      } else {
        socket.io.engine.off('upgrade')
      }
    },

    onUpgrade() {
      this.currentTransport = socket.io.engine.transport.name
    },

    onMessage({ user, message }) {
      this.messages.push({ user, message })

      this.message = ''

      this.$nextTick(() => this.scrollToBottom())

      this.$emit('message')
    },

    sendChatMessage() {
      if (!this.connected) alert('Not connected')

      if (this.chatMessage.length === 0) return

      socket.emit('chatMessage', this.chatMessage)

      this.chatMessage = ''
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
