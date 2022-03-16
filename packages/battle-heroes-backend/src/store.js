const { NFTSlice } = require('./NFT')
const { playerSlice } = require('./player')
const { messageSlice } = require('./message')
const { createStore, combineReducers } = require('redux')

const reducer = combineReducers({
  NFT: NFTSlice.reducer,
  player: playerSlice.reducer,
  message: messageSlice.reducer
})

module.exports = createStore(reducer)
