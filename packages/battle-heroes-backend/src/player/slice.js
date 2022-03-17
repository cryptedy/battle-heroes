const { createSlice } = require('@reduxjs/toolkit')

const initialState = {
  players: []
}

module.exports = createSlice({
  name: 'player',
  initialState,
  reducers: {
    setPlayers: (state, action) => {
      console.log('player/setPlayer', action)

      console.log(action.payload)

      const availableUsers = action.payload.filter(
        user => user.address !== undefined
      )

      console.log(availableUsers)

      state.players = availableUsers
    },
    addPlayer: (state, action) => {
      console.log('player/addPlayer', action)

      state.players.push(action.payload)
    },
    updatePlayerState: (state, action) => {
      console.log('player/updatePlayerState', action)

      const player = state.players.find(
        player => player.id === action.payload.player.id
      )

      if (player) {
        player.state = action.payload.state
      }
    },
    addPlayerSocket: (state, action) => {
      console.log('player/addPlayerSocket', action)

      const player = state.players.find(
        player => player.id === action.payload.player.id
      )

      if (player) {
        player.socket_ids.push(action.payload.socket.id)
      }
    },
    removePlayerSocket: (state, action) => {
      console.log('player/removePlayerSocket', action)

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
