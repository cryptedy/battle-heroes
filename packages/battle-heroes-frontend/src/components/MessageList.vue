<template>
  <BaseEmpty v-if="!messages.length > 0" text="NO MESSAGES" />

  <BaseList v-else class="message-list">
    <MessageListItem
      v-for="message in messages"
      :key="message.id"
      :message="message"
    />
  </BaseList>
</template>

<script>
import MessageListItem from '@/components/MessageListItem'

export default {
  name: 'MessageList',

  components: {
    MessageListItem
  },

  props: {
    messages: {
      type: Array,
      required: true
    }
  }
}
</script>
