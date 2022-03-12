const { createStore } = require('redux')
const { COLLECTIONS } = require('./constants')

const NFTs = {}

for (const collectionId of Object.keys(COLLECTIONS)) {
  NFTs[collectionId] = []
}

const initialState = {
  NFTs,
  players: [],
  messages: []
}

function reducer(state, action) {
  const { payload, type } = action

  switch (type) {
    case 'SET_NFTs':
      return {
        ...state,
        NFTs: payload
      }
    case 'ADD_PLAYER':
      return {
        ...state,
        players: [...state.players, payload]
      }
    case 'REMOVE_PLAYER':
      return {
        ...state,
        players: state.players.filter(
          player => player.socket_id !== payload.socket_id
        )
      }
    case 'SET_MESSAGE':
      return {
        ...state,
        messages: [...state.messages, payload]
      }
    case 'UPDATE_PLAYER_STATE':
      return {
        ...state,
        players: state.players.map(player =>
          player.socket_id === payload.id
            ? { ...player, state: payload.state }
            : player
        )
      }
    default:
      return state
  }
}

module.exports = createStore(reducer, initialState)
