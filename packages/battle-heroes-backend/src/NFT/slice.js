const { createSlice } = require('@reduxjs/toolkit')
const { COLLECTIONS } = require('../utils/constants')

const initialState = () => {
  const NFTs = {}

  for (const collection of COLLECTIONS) {
    NFTs[collection.id] = []
  }

  return {
    NFTs
  }
}

module.exports = createSlice({
  name: 'NFT',
  initialState: initialState(),
  reducers: {
    set: (state, action) => {
      console.log('NFT/set')

      Object.keys(action.payload).forEach(collectionId => {
        state.NFTs[collectionId] = action.payload[collectionId]
      })
    }
  }
})
