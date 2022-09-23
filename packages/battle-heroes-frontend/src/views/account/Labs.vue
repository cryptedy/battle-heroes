<template>
  <h1>{{ message }}</h1>

  <hr />

  <p>{{ player.name }}</p>

  <hr />

  <BaseButton type="primary" @click="addTokenExp"> Add Exp </BaseButton>
  <BaseButton type="primary" @click="getTokenExp"> Get Exp </BaseButton>
  <BaseButton type="primary" @click="mintTokenExp">
    Transfer Exp to Chain
  </BaseButton>
  <P>CollectionId:</P>
  <input v-model="colId1" type="text" style="color: #000000" />
  <P>TokenId:</P>
  <input v-model="tokenId1" type="text" style="color: #000000" />
  <P>Delta Exp:</P>
  <input v-model="exp1" type="text" style="color: #000000" />

  <div v-if="isCalled">
    <p>METHOD CALLED!</p>
    <BaseButton type="primary" @click="reset"> RESET </BaseButton>
  </div>
  <p v-else>DEFAULT</p>
</template>

<script>
import { mapGetters } from 'vuex'
import { NOTIFICATION_TYPE } from '../../utils/constants'

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

    addTokenExp() {
      console.log(
        'AddExp called!',
        parseInt(this.colId1),
        parseInt(this.tokenId1),
        parseInt(this.exp1)
      )

      this.$socket.emit(
        'tokenExp:add',
        parseInt(this.colId1),
        parseInt(this.tokenId1),
        parseInt(this.exp1)
      )
      this.isCalled = true
      this.message = 'AddExp caled!'
    },

    getTokenExp() {
      console.log(
        'GetExp called!',
        parseInt(this.colId1),
        parseInt(this.tokenId1)
      )

      this.$socket.emit(
        'tokenExp:get',
        parseInt(this.colId1),
        parseInt(this.tokenId1)
      )
      this.isCalled = true
      this.message = 'GetExp caled!'
    },

    mintTokenExp() {
      console.log(
        'Transfer Exp called!',
        parseInt(this.colId1),
        parseInt(this.tokenId1),
        parseInt(this.exp1)
      )

      this.$socket.emit(
        'tokenExp:mint',
        parseInt(this.colId1),
        parseInt(this.tokenId1),
        parseInt(this.exp1),
        ({ status, message, payload }) => {
          console.log('tokenExp:minted', status, message, payload)
          if (status) {
            // トランザクション発行処理
            const {
              startBlockNumber,
              collectionId,
              tokenId,
              dexp,
              nonce,
              hash
            } = payload

            this.addNotification({
              message,
              type: NOTIFICATION_TYPE.SUCCESS
            })
          } else {
            this.addNotification({
              message,
              type: NOTIFICATION_TYPE.ERROR,
              timeout: 0
            })
          }
        }
      )
      this.isCalled = true
      this.message = 'AddExp caled!'
    }
  }
}
</script>
