<template>
  <TheLayoutGame>
    <div class="view-messages">
      <MessageList
        ref="messageList"
        :messages="messages"
        v-bind="$attrs"
        :style="messageListStyleObject"
      />

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
import { getScrollbarState } from '@/utils/helpers'
import { ADD_MESSAGE } from '@/store/mutation-types'
import TheLayoutGame from '@/components/TheLayoutGame'

export default {
  name: 'Messages',

  components: {
    MessageList,
    TheLayoutGame
  },

  data() {
    return {
      unsubscribeMessage: null,
      messageFormShown: false,
      newMessage: '',
      hasVerticalScrollbar: false
    }
  },

  computed: {
    ...mapGetters({
      messages: 'message/all',
      windowHeight: 'window/height',
      scrollbarWidth: 'scrollbar/width'
    }),

    messageListStyleObject() {
      let paddingRight = 0

      if (this.hasVerticalScrollbar) {
        paddingRight = this.scrollbarWidth
      }

      return {
        paddingRight: paddingRight > 0 ? `${paddingRight}px` : paddingRight
      }
    }
  },

  watch: {
    // eslint-disable-next-line no-unused-vars
    windowHeight(value, oldValue) {
      this.setHasVerticalScrollbar()
    }
  },

  mounted() {
    // eslint-disable-next-line no-unused-vars
    this.unsubscribeMessage = store.subscribe((mutation, state) => {
      if (mutation.type === `message/${ADD_MESSAGE}`) {
        this.$nextTick(() => {
          this.scrollToBottom()
          this.setHasVerticalScrollbar()
        })
      }
    })

    this.messageFormShown = true

    const $gameMain = document.querySelector('.game-main')

    if ($gameMain) {
      $gameMain.classList.add('has-chat-animation')

      setTimeout(() => {
        $gameMain.classList.remove('has-chat-animation')
      }, 2250)
    }

    this.$nextTick(() => {
      this.scrollToBottom()
      this.setHasVerticalScrollbar()
    })
  },

  beforeUnmount() {
    if (this.unsubscribeMessage) {
      this.unsubscribeMessage()
      this.unsubscribeMessage = null
    }
  },

  methods: {
    setHasVerticalScrollbar() {
      try {
        this.hasVerticalScrollbar = getScrollbarState(
          this.$refs.messageList.$el
        ).vertical

        // eslint-disable-next-line no-empty
      } catch (error) {}
    },

    sendMessage() {
      if (this.newMessage.length === 0 || this.newMessage.match('^( |　)+$'))
        return

      this.$socket.emit('message:create', this.newMessage)

      this.newMessage = ''
    },

    scrollToBottom() {
      try {
        this.$refs.messageList.$el.scrollTo(
          0,
          this.$refs.messageList.$el.scrollHeight
        )
        // eslint-disable-next-line no-empty
      } catch (error) {}
    }
  }
}
</script>
