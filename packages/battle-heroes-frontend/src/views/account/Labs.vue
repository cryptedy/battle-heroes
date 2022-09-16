<template>
  <h1>{{ message }}</h1>

  <hr />

  <p>{{ player.name }}</p>

  <hr />

  <BaseButton type="primary" @click="sampleMethod"> Get Exp </BaseButton>
  <P>CollectionId:</P>
  <input v-model="colId1" type="text" style="color: #000000" />
  <P>TokenId:</P>
  <input v-model="tokenId1" type="text" style="color: #000000" />
  <P>Exp:</P>
  <input v-model="exp1" type="text" style="color: #000000" />

  <div v-if="isCalled">
    <p>SAMPLE METHOD CALLED!</p>
    <BaseButton type="primary" @click="reset"> RESET </BaseButton>
  </div>
  <p v-else>DEFAULT</p>
</template>

<script>
import { mapGetters } from 'vuex'

const DEFAULT_MESSAGE = 'Welcome to Labs'

export default {
  name: 'AccountLabsView',

  data() {
    return {
      message: DEFAULT_MESSAGE,
      isCalled: false,
      colId1: 1,
      tokenId1: 1,
      exp1: 0
    }
  },

  computed: {
    ...mapGetters({
      player: 'game/player'
    })
  },

  created() {
    console.log('component created')
  },

  mounted() {
    console.log('component mounted')
  },

  methods: {
    reset() {
      console.log('reset!')

      this.isCalled = false
      this.message = DEFAULT_MESSAGE
    },

    sampleMethod() {
      console.log(
        'getExp called!',
        parseInt(this.colId1),
        parseInt(this.tokenId1),
        parseInt(this.exp1)
      )

      this.$socket.emit(
        'test:test',
        parseInt(this.colId1),
        parseInt(this.tokenId1),
        parseInt(this.exp1)
      )
      this.isCalled = true
      this.message = 'getExp caled!'
    }
  }
}
</script>
