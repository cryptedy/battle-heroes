<template>
  <ul>
    <li v-for="message in messages" :key="message.id">
      <BasePlayerAvatar :player="message.player" />

      {{ message.player.name }}
      -
      {{ message.text }}
      -
      {{ $filters.datetime(message.posted_at) }}
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
  name: 'Message',

  data() {
    return {
      newMessage: ''
    }
  },

  computed: {
    ...mapGetters({
      messages: 'message/all'
    })
  },

  watch: {
    messages: {
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
    sendMessage() {
      if (this.newMessage.length === 0 || this.newMessage.match('^( |　)+$'))
        return

      this.$socket.emit('message:new', this.newMessage)

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
