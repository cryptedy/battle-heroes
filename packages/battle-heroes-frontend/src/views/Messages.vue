<template>
  <TheLayout>
    <h1>MESSAGES</h1>

    <p v-if="!messages.length > 0">No messages.</p>

    <BaseList v-else>
      <BaseListItem v-for="message in messages" :key="message.id">
        <PlayerAvatar :player="message.player" />

        {{ message.player.name }}
        -
        {{ message.text }}
        -
        {{ $filters.datetime(message.posted_at) }}
        <hr />
      </BaseListItem>
    </BaseList>

    <form @submit.prevent="sendMessage">
      <input
        ref="input"
        v-model="newMessage"
        placeholder="Send message"
        type="text"
      />
    </form>
  </TheLayout>
</template>

<script>
import { mapGetters } from 'vuex'
import TheLayout from '@/components/TheLayout'
import PlayerAvatar from '@/components/PlayerAvatar'

export default {
  name: 'Message',

  components: {
    TheLayout,
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
