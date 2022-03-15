const { PLAYER_STATE } = require('../utils/constants')
const { getUserProfile, getUserTokenIds } = require('../user')
const { createSlice, createSelector } = require('@reduxjs/toolkit')

const initialState = {
  players: []
}

const playerSlice = createSlice({
  name: 'player',
  initialState,
  reducers: {
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

const selectPlayers = state => state.players

const playerSelectors = {
  selectPlayers,
  selectPlayerBySocket: createSelector(
    selectPlayers,
    players => socket =>
      players.find(player => player.socket_ids.includes(socket.id))
  ),
  selectPlayerByUser: createSelector(
    selectPlayers,
    players => user => players.find(player => player.user_id == user.id)
  )
}

const createPlayer = async (user, socket) => {
  const profile = await getUserProfile(user)
  const tokenIds = await getUserTokenIds(user)

  return {
    id: user.id,
    user_id: user.id,
    name: profile.name,
    avatar_url: profile.avatar_url,
    address: user.address,
    socket_ids: [socket.id],
    token_ids: tokenIds,
    level: 1,
    state: PLAYER_STATE.IDLE
  }
}

module.exports = {
  playerSlice,
  playerSelectors,
  createPlayer
}
