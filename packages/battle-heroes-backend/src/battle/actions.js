const store = require('../store')
const { add, remove, update, join } = require('./slice').actions

module.exports = {
  addBattle: payload => store.dispatch(add(payload)),
  removeBattle: payload => store.dispatch(remove(payload)),
  updateBattle: payload => store.dispatch(update(payload)),
  joinBattle: payload => store.dispatch(join(payload))
}
