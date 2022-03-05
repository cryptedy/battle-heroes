<template>
  <ul>
    <li v-for="({ user, text }, index) in messages" :key="index">
      <span
        v-if="!user.image_url"
        style="
          display: inline-block;
          background-color: gray;
          width: 32px;
          height: 32px;
          color: white;
          font-size: 10px;
        "
      >
        BOT
      </span>
      <img v-else :src="user.image_url" width="32" height="32" />
      {{ user.name }}
      -
      {{ text }}
      <hr />
    </li>
  </ul>

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
