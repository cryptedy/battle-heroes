const { createSlice } = require('@reduxjs/toolkit')

const initialState = {
  entities: {},
  ids: []
}

module.exports = createSlice({
  name: 'game',
  initialState,
  reducers: {
    add: (state, { payload: game }) => {
      console.log('game/add', game.id)

      state.entities[game.id] = game
      state.ids.push(game.id)
    },
    remove: (state, { payload: gameId }) => {
      console.log('game/remove', gameId)

      delete state.entities[gameId]

      const index = state.ids.findIndex(id => id === gameId)
      if (index !== -1) state.ids.splice(index, 1)
    },
    update: (state, { payload }) => {
      console.log('game/update', payload)

      const { gameId, payload: newState } = payload

      state.entities[gameId] = { ...state.entities[gameId], ...newState }
    },
    updatePlayer: (state, { payload }) => {
      console.log('game/updatePlayer', payload)

      const { gameId, playerKey, payload: newState } = payload

      state.entities[gameId].players[playerKey] = {
        ...state.entities[gameId].players[playerKey],
        ...newState
      }
    }
  }
})
