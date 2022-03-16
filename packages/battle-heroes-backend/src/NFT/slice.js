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
    setNFTs: (state, action) => {
      console.log('NFT/add')

      Object.keys(action.payload).forEach(collectionId => {
        state.NFTs[collectionId] = action.payload[collectionId]
      })
    }
  }
})
