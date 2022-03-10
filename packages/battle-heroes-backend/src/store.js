const { createStore } = require('redux')

const initialState = {
  players: [],
  messages: []
}

function reducer(state, action) {
  const { payload, type } = action

  switch (type) {
    case 'SET_PLAYER':
      return {
        ...state,
        players: [...state.players, payload]
      }
    case 'DELETE_PLAYER':
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
    default:
      return state
  }
}

module.exports = createStore(reducer, initialState)
