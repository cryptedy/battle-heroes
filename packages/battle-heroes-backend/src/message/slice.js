const { createSlice } = require('@reduxjs/toolkit')

const initialState = {
  messages: []
}

module.exports = createSlice({
  name: 'message',
  initialState,
  reducers: {
    addMessage: (state, action) => {
      console.log('message/addMessage')

      state.messages.push(action.payload)
    }
  }
})
