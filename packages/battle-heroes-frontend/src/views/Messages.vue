<template>
  <TheLayoutGame>
    <div class="messages">
      <div ref="messageList" class="message-list">
        <MessageList :messages="messages" />
      </div>

      <transition name="message-form">
        <div v-if="messageFormShown" class="message-form">
          <form @submit.prevent="sendMessage">
            <input
              ref="input"
              v-model="newMessage"
              placeholder="Send message"
              type="text"
            />
          </form>
        </div>
      </transition>
    </div>
  </TheLayoutGame>
</template>

<script>
import store from '@/store'
import { mapGetters } from 'vuex'
import MessageList from '@/components/MessageList'
import TheLayoutGame from '@/components/TheLayoutGame'
import { ADD_MESSAGE } from '@/store/mutation-types'

export default {
  name: 'Messages',

  components: {
    MessageList,
    TheLayoutGame
  },

  data() {
    return {
      unsubscribe: null,
      messageFormShown: false,
      newMessage: ''
    }
  },

  computed: {
    ...mapGetters({
      messages: 'message/all'
    })
  },

  mounted() {
    this.messageFormShown = true

    document.querySelector('.game-main').classList.add('has-chat-animation')

    setTimeout(() => {
      document
        .querySelector('.game-main')
        .classList.remove('has-chat-animation')
    }, 2250)

    this.$nextTick(() => this.scrollToBottom())
  },

  beforeUnmount() {
    if (this.unsubscribe) {
      this.unsubscribe()
      this.unsubscribe = null
    }
  },

  methods: {
    sendMessage() {
      if (this.newMessage.length === 0 || this.newMessage.match('^( |　)+$'))
        return

      // eslint-disable-next-line no-unused-vars
      this.unsubscribe = store.subscribe((mutation, state) => {
        if (mutation.type === `message/${ADD_MESSAGE}`) {
          this.$nextTick(() => {
            this.scrollToBottom()
          })

          this.unsubscribe()
          this.unsubscribe = null
        }
      })

      this.$socket.emit('message:new', this.newMessage)

      this.newMessage = ''
    },

    scrollToBottom() {
      try {
        this.$refs.messageList.scrollTo(0, this.$refs.messageList.scrollHeight)
      } catch (error) {
        //
      }
    }
  }
}
</script>
