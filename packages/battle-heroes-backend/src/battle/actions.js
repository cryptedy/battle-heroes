const store = require('../store')
const { add, remove } = require('./slice').actions

module.exports = {
  addBattle: payload => store.dispatch(add(payload)),
  removeBattle: payload => store.dispatch(remove(payload))
}
