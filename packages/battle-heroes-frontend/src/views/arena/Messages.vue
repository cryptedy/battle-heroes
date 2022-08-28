<template>
  <div class="messages">
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
</template>

<script>
import store from '@/store'
import { mapGetters } from 'vuex'
import MessageList from '@/components/MessageList'
import { ADD_MESSAGE } from '@/store/mutation-types'
import { getScrollbarState, scrollToBottom } from '@/utils/helpers'

export default {
  name: 'ChatView',

  components: {
    MessageList
  },

  data() {
    return {
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
      this.checkVerticalScrollbar()
    }
  },

  mounted() {
    // eslint-disable-next-line no-unused-vars
    this.unsubscribeNewMessage = store.subscribe((mutation, state) => {
      if (mutation.type === `message/${ADD_MESSAGE}`) {
        this.$nextTick(() => {
          scrollToBottom(this.$refs.messageList.$el, true)
          this.checkVerticalScrollbar()
        })
      }
    })

    this.messageFormShown = true

    const $messages = document.querySelector('.messages')

    if ($messages) {
      $messages.classList.add('has-chat-animation')

      setTimeout(() => {
        $messages.classList.remove('has-chat-animation')
      }, 2250)
    }

    this.$nextTick(() => {
      scrollToBottom(this.$refs.messageList.$el, false)
      this.checkVerticalScrollbar()
    })
  },

  beforeUnmount() {
    this.unsubscribeNewMessage()
  },

  methods: {
    checkVerticalScrollbar() {
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
    }
  }
}
</script>
