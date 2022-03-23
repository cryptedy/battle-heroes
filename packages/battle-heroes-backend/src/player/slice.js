const { createSlice } = require('@reduxjs/toolkit')

const initialState = {
  entities: {},
  ids: []
}

module.exports = createSlice({
  name: 'player',
  initialState,
  reducers: {
    set: (state, action) => {
      console.log('player/set', action)

      const entities = {}

      const availableUsers = action.payload.filter(
        user => user.address !== undefined
      )

      for (const availableUser of availableUsers) {
        entities[availableUser.id] = availableUser
      }

      state.entities = entities
      state.ids = action.payload.map(player => player.id)
    },
    add: (state, action) => {
      console.log('player/add', action)

      state.entities[action.payload.id] = action.payload
      state.ids.push(action.payload.id)
    },
    updateState: (state, action) => {
      console.log('player/updateState', action)

      state.entities[action.payload.player.id].state = action.payload.state
    },
    addSocket: (state, action) => {
      console.log('player/addSocket', action)

      const { player, socket } = action.payload

      state.entities[player.id].socket_ids.push(socket.id)
    },
    removeSocket: (state, action) => {
      console.log('player/removeSocket', action)

      const { player, socket } = action.payload

      state.entities[player.id].socket_ids = state.entities[
        player.id
      ].socket_ids.filter(socketId => socketId !== socket.id)
    }
  }
})
