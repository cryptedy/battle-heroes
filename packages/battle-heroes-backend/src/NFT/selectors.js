const store = require('../store')
const { createSelector } = require('@reduxjs/toolkit')

const selectNFTs = state => state.ids.map(id => state.entities[id])

const getState = () => store.getState().NFT

const selectors = {
  selectNFTs,
  selectNFT: createSelector(
    selectNFTs,
    NFTs => NTFId => NFTs.find(NFT => NFT.id == NTFId)
  )
}

module.exports = {
  selectNFTs: () => selectors.selectNFTs(getState()),
  selectNFT: NFTId => selectors.selectNFT(getState())(NFTId)
}
