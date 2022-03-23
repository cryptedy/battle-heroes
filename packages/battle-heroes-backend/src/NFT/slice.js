const { createSlice } = require('@reduxjs/toolkit')

const initialState = {
  entities: {},
  ids: []
}

module.exports = createSlice({
  name: 'NFT',
  initialState,
  reducers: {
    set: (state, action) => {
      console.log('NFT/set')

      const entities = {}

      for (const NFT of action.payload) {
        entities[NFT.id] = NFT
      }

      state.entities = entities
      state.ids = action.payload.map(NFT => NFT.id)
    }
  }
})
