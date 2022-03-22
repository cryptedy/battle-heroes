const store = require('../store')
const { add } = require('./slice').actions

module.exports = {
  addMessage: payload => store.dispatch(add(payload))
}
