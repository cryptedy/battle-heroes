const { createSlice } = require('@reduxjs/toolkit')

const initialState = {
  games: []
}

module.exports = createSlice({
  name: 'game',
  initialState,
  reducers: {
    addGame: (state, action) => {
      console.log('game/addGame')

      state.games.push(action.payload)
    }
  }
})
