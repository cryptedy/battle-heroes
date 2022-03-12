<template>
  <ul>
    <li v-for="(message, index) in messages" :key="index">
      <BasePlayerAvatar :player="message.player" />

      {{ message.player.name }}
      -
      {{ message.text }}
      -
      {{ message.posted_at }}
      <hr />
    </li>
  </ul>

  <form @submit.prevent="sendMessage">
    <input
      ref="input"
      v-model="newMessage"
      v-focus
      placeholder="Send message"
      type="text"
    />
  </form>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Messages',

  data() {
    return {
      newMessage: ''
    }
  },

  computed: {
    ...mapGetters({
      messages: 'chat/messages'
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
    // TODO: no effect
    this.$nextTick(() => this.scrollToBottom())
  },

  methods: {
    sendMessage() {
      if (this.newMessage.length === 0 || this.newMessage.match('^( |　)+$'))
        return

      this.$socket.emit('chat:newMessage', this.newMessage)

      this.newMessage = ''
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
