const { createStore } = require('redux')
const { COLLECTIONS } = require('./constants')

const NFTs = {}

for (const collection of COLLECTIONS) {
  NFTs[collection.id] = []
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
      console.log(payload)
      return {
        ...state,
        players: [...state.players, payload.player]
      }
    case 'UPDATE_PLAYER':
      return {
        ...state,
        players: state.players.map(player =>
          player.id === payload.id ? { ...player, payload } : player
        )
      }
    case 'SET_MESSAGE':
      return {
        ...state,
        messages: [...state.messages, payload.message]
      }
    default:
      return state
  }
}

module.exports = createStore(reducer, initialState)
