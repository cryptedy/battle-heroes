<template>
  <LayoutMain>
    <p v-if="!messages.length > 0">No messages.</p>
    <ul v-else>
      <li v-for="message in messages" :key="message.id">
        <PlayerAvatar :player="message.player" />

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
  </LayoutMain>
</template>

<script>
import { mapGetters } from 'vuex'
import LayoutMain from '@/components/LayoutMain'
import PlayerAvatar from '@/components/PlayerAvatar'

export default {
  name: 'Message',

  components: {
    LayoutMain,
    PlayerAvatar
  },

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

<style lang="scss">
input {
  color: color(primary);
}
</style>
