<template>
  <ul>
    <li v-for="(chatMessage, index) in chatMessages" :key="index">
      <BasePlayerAvatar :player="chatMessage.player" />

      {{ chatMessage.player.name }}
      -
      {{ chatMessage.text }}
      -
      {{ $filters.datetime(chatMessage.posted_at) }}
      <hr />
    </li>
  </ul>

  <form @submit.prevent="sendChatMessage">
    <input
      ref="input"
      v-model="newChatMessage"
      v-focus
      placeholder="Send message"
      type="text"
    />
  </form>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Chat',

  data() {
    return {
      newChatMessage: ''
    }
  },

  computed: {
    ...mapGetters({
      chatMessages: 'chat/messages'
    })
  },

  watch: {
    chatMessages: {
      handler() {
        this.$nextTick(() => this.scrollToBottom())
      },
      deep: true
    }
  },

  mounted() {
    // TODO: no effect
    this.$nextTick(() => this.scrollToBottom())
  },

  methods: {
    sendChatMessage() {
      if (
        this.newChatMessage.length === 0 ||
        this.newChatMessage.match('^( |　)+$')
      )
        return

      this.$socket.emit('chat:newMessage', this.newChatMessage)

      this.newChatMessage = ''
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
