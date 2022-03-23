const { createSlice } = require('@reduxjs/toolkit')

const initialState = {
  entities: {},
  ids: []
}

module.exports = createSlice({
  name: 'battle',
  initialState,
  reducers: {
    add: (state, action) => {
      console.log('battle/add')

      state.entities[action.payload.id] = action.payload
      state.ids.push(action.payload.id)
    },
    remove: (state, action) => {
      console.log('battle/remove')

      delete state.entities[action.payload.id]

      const index = state.ids.findIndex(id => id === action.payload.id)

      if (index != -1) {
        state.ids.splice(index, 1)
      }
    }
  }
})
