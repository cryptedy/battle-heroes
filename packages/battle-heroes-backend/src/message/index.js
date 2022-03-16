const moment = require('moment')
const { createSlice, nanoid } = require('@reduxjs/toolkit')

const initialState = {
  messages: []
}

const messageSlice = createSlice({
  name: 'message',
  initialState,
  reducers: {
    addMessage: (state, action) => {
      console.log('message/addMessage')

      state.messages.push(action.payload)
    }
  }
})

const messageSelectors = {
  selectMessages: state => state.messages
}

const createMessage = (text, player) => {
  return {
    id: nanoid(),
    player,
    text,
    posted_at: moment().unix()
  }
}

module.exports = {
  messageSlice,
  messageSelectors,
  createMessage
}
