const store = require('../store')
const { set } = require('./slice').actions

module.exports = {
  setNFTs: payload => store.dispatch(set(payload))
}
