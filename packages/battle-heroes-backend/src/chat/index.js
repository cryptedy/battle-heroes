const moment = require('moment')
const { createSlice } = require('@reduxjs/toolkit')

const initialState = {
  messages: []
}

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    addMessage: (state, action) => {
      console.log('chat/addMessage')

      const { payload } = action

      const message = createMessage(payload.text, payload.player)

      state.messages.push(message)
    }
  }
})

const chatSelectors = {
  selectMessages: state => state.messages
}

const createMessage = (text, player) => {
  return {
    player,
    text,
    posted_at: moment().unix()
  }
}

module.exports = {
  chatSlice,
  chatSelectors,
  createMessage
}
