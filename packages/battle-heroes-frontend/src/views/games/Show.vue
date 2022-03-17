<template>
  <LayoutMain> GamesShow </LayoutMain>
</template>

<script>
import LayoutMain from '@/components/LayoutMain'

export default {
  name: 'GamesShow',

  components: {
    LayoutMain
  },

  created() {
    this.$socket.emit('game:join')
  }
}
</script>
