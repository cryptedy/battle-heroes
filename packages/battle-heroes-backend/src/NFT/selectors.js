const store = require('../store')

const selectors = {
  selectNFTs: state => state.NFTs
}

const getState = () => store.getState().NFT

module.exports = {
  selectNFTs: () => selectors.selectNFTs(getState())
}
