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
      console.log('player/set', players)

      const entities = {}

      const availableUsers = players.filter(user => user.address !== undefined)

      for (const availableUser of availableUsers) {
        entities[availableUser.id] = availableUser
      }

      state.entities = entities
      state.ids = players.map(player => player.id)
    },
    add: (state, { payload: player }) => {
      console.log('player/add', player)

      state.entities[player.id] = player
      state.ids.push(player.id)
    },
    update: (state, { payload }) => {
      console.log('player/update', payload)

      const { playerId, payload: newState } = payload

      state.entities[playerId] = { ...state.entities[playerId], ...newState }
    },
    addSocket: (state, { payload }) => {
      console.log('player/addSocket', payload)

      const { playerId, socketId } = payload

      state.entities[playerId].socket_ids.push(socketId)
    },
    removeSocket: (state, { payload }) => {
      console.log('player/removeSocket', payload)

      const { playerId, socketId: removeSocketId } = payload

      state.entities[playerId].socket_ids = state.entities[
        playerId
      ].socket_ids.filter(socketId => socketId !== removeSocketId)
    }
  }
})
