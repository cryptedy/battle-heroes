const store = require('../store')
const { set, add, update } = require('./slice').actions

module.exports = {
  setNFTs: payload => store.dispatch(set(payload)),
  addNFT: payload => store.dispatch(add(payload)),
  updateNFT: payload => store.dispatch(update(payload))
}
