const { createSlice } = require('@reduxjs/toolkit')

const initialState = {
  entities: {},
  ids: []
}

module.exports = createSlice({
  name: 'message',
  initialState,
  reducers: {
    add: (state, action) => {
      console.log('message/add')

      state.entities[action.payload.id] = action.payload
      state.ids.push(action.payload.id)
    }
  }
})
