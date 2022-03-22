const NFTRecucer = require('./NFT/slice').reducer
const playerReducer = require('./player/slice').reducer
const messageReducer = require('./message/slice').reducer
const battleReducer = require('./battle/slice').reducer
const { createStore, combineReducers } = require('redux')

const reducer = combineReducers({
  NFT: NFTRecucer,
  player: playerReducer,
  message: messageReducer,
  battle: battleReducer
})

module.exports = createStore(reducer)
