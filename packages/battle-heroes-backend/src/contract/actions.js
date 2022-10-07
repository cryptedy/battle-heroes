const store = require('../store')
const { set } = require('./slice').actions

module.exports = {
  setContracts: payload => store.dispatch(set(payload))
}
