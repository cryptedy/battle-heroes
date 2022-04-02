const store = require('../store')
const { add, remove } = require('./slice').actions

module.exports = {
  addMessage: payload => store.dispatch(add(payload)),
  removeMessage: payload => store.dispatch(remove(payload))
}
