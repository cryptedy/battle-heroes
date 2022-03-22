const { createSlice } = require('@reduxjs/toolkit')

const initialState = {
  players: []
}

module.exports = createSlice({
  name: 'player',
  initialState,
  reducers: {
    set: (state, action) => {
      console.log('player/set', action)

      console.log(action.payload)

      const availableUsers = action.payload.filter(
        user => user.address !== undefined
      )

      console.log(availableUsers)

      state.players = availableUsers
    },
    add: (state, action) => {
      console.log('player/add', action)

      state.players.push(action.payload)
    },
    updateState: (state, action) => {
      console.log('player/updateState', action)

      const player = state.players.find(
        player => player.id === action.payload.player.id
      )

      if (player) {
        player.state = action.payload.state
      }
    },
    addSocket: (state, action) => {
      console.log('player/addSocket', action)

      const player = state.players.find(
        player => player.id === action.payload.player.id
      )

      if (player) {
        player.socket_ids.push(action.payload.socket.id)
      }
    },
    removeSocket: (state, action) => {
      console.log('player/removeSocket', action)

      const player = state.players.find(player =>
        player.socket_ids.includes(action.payload.id)
      )

      if (player) {
        player.socket_ids = player.socket_ids.filter(
          socketId => socketId !== action.payload.id
        )
      }
    }
  }
})
