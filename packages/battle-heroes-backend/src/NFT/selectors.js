const store = require('../store')
const { NFTSelectors } = require('./')

const getState = () => store.getState().NFT

const selectors = {
  all: () => NFTSelectors.selectNFTs(getState())
}

module.exports = selectors
