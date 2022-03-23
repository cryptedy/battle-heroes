const store = require('../store')

const selectors = {
  selectNFTs: state => state.ids.map(id => state.entities[id])
}

const getState = () => store.getState().NFT

module.exports = {
  selectNFTs: () => selectors.selectNFTs(getState())
}
