const { createSlice } = require('@reduxjs/toolkit')

const initialState = {
  entities: {},
  ids: []
}

module.exports = createSlice({
  name: 'NFT',
  initialState,
  reducers: {
    set: (state, { payload: NFTs }) => {
      console.log('NFT/set', NFTs.length)

      const entities = {}

      for (const NFT of NFTs) {
        entities[NFT.id] = NFT
      }

      state.entities = entities
      state.ids = NFTs.map(NFT => NFT.id)
    },
    add: (state, { payload: NFT }) => {
      console.log('NFT/add', NFT.id)

      state.entities[NFT.id] = NFT
      state.ids.push(NFT.id)
    }
  }
})
