const NFTRecucer = require('./NFT/slice').reducer
const playerReducer = require('./player/slice').reducer
const messageReducer = require('./message/slice').reducer
const gameReducer = require('./game/slice').reducer
const { createStore, combineReducers } = require('redux')

const reducer = combineReducers({
  NFT: NFTRecucer,
  player: playerReducer,
  message: messageReducer,
  game: gameReducer
})

module.exports = createStore(reducer)
