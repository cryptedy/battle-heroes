const store = require('../store')
const { NFTSelectors } = require('./')

const getState = () => store.getState().NFT

const selectors = {
  selectNFTs: () => NFTSelectors.selectNFTs(getState())
}

module.exports = selectors
