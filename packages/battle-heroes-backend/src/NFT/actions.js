const store = require('../store')
const { set, add } = require('./slice').actions

module.exports = {
  setNFTs: payload => store.dispatch(set(payload)),
  addNFT: payload => store.dispatch(add(payload))
}
