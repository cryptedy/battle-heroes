const { createSlice } = require('@reduxjs/toolkit')

const initialState = {
  messages: []
}

module.exports = createSlice({
  name: 'message',
  initialState,
  reducers: {
    add: (state, action) => {
      console.log('message/add')

      state.messages.push(action.payload)
    }
  }
})
