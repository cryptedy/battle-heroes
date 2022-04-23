const { createSlice } = require('@reduxjs/toolkit')

const initialState = {
  entities: {},
  ids: []
}

module.exports = createSlice({
  name: 'player',
  initialState,
  reducers: {
    set: (state, { payload: players }) => {
      console.log('player/set', players.length)

      const entities = {}

      const availableUsers = players.filter(user => user.address !== undefined)

      for (const availableUser of availableUsers) {
        entities[availableUser.id] = availableUser
      }

      state.entities = entities
      state.ids = players.map(player => player.id)
    },
    add: (state, { payload: player }) => {
      console.log('player/add', player.id)

      state.entities[player.id] = player
      state.ids.push(player.id)
    },
    update: (state, { payload }) => {
      console.log('player/update', payload)

      const { playerId, payload: newState } = payload

      state.entities[playerId] = { ...state.entities[playerId], ...newState }
    }
  }
})
