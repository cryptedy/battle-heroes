const { NFTSlice } = require('./NFT')
const { chatSlice } = require('./chat')
const { playerSlice } = require('./player')
const { createStore, combineReducers } = require('redux')

const reducer = combineReducers({
  NFT: NFTSlice.reducer,
  chat: chatSlice.reducer,
  player: playerSlice.reducer
})

module.exports = createStore(reducer)
