const collectionRecucer = require('./collection/slice').reducer
const NFTReducer = require('./NFT/slice').reducer
const playerReducer = require('./player/slice').reducer
const messageReducer = require('./message/slice').reducer
const battleReducer = require('./battle/slice').reducer
const gameReducer = require('./game/slice').reducer
const contractReducer = require('./contract/slice').reducer
const { createStore, combineReducers } = require('redux')

const reducer = combineReducers({
  collection: collectionRecucer,
  NFT: NFTReducer,
  player: playerReducer,
  message: messageReducer,
  battle: battleReducer,
  game: gameReducer,
  contract: contractReducer
})

module.exports = createStore(reducer)
