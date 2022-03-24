<template>
  <p v-if="!messages.length > 0">No messages.</p>

  <BaseList v-else>
    <BaseListItem v-for="message in messages" :key="message.id">
      <Message :message="message" />
    </BaseListItem>
  </BaseList>
</template>

<script>
import Message from '@/components/Message'

export default {
  name: 'MessageList',

  components: {
    Message
  },

  props: {
    messages: {
      type: Array,
      required: true
    }
  }
}
</script>
