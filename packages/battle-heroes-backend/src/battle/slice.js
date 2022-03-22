const { createSlice } = require('@reduxjs/toolkit')

const initialState = {
  battles: []
}

module.exports = createSlice({
  name: 'battle',
  initialState,
  reducers: {
    add: (state, action) => {
      console.log('battle/add')

      state.battles.push(action.payload)
    },
    remove: (state, action) => {
      console.log('battle/remove')

      const index = state.battles.findIndex(
        battle => battle.id === action.payload.id
      )

      if (index != -1) {
        state.battles.splice(index, 1)
      }
    }
  }
})
