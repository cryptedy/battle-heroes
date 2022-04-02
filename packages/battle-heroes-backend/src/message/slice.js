const { createSlice } = require('@reduxjs/toolkit')

const initialState = {
  entities: {},
  ids: []
}

module.exports = createSlice({
  name: 'message',
  initialState,
  reducers: {
    add: (state, { payload: message }) => {
      console.log('message/add', message)

      state.entities[message.id] = message
      state.ids.push(message.id)
    },
    remove: (state, { payload: messageId }) => {
      console.log('message/remove', messageId)

      delete state.entities[messageId]

      const index = state.ids.findIndex(id => id === messageId)
      if (index !== -1) state.ids.splice(index, 1)
    }
  }
})
