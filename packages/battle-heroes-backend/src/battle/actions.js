const store = require('../store')
const { add, remove, update, join, changeTurn, updateStatus } =
  require('./slice').actions

module.exports = {
  addBattle: payload => store.dispatch(add(payload)),
  removeBattle: payload => store.dispatch(remove(payload)),
  updateBattle: payload => store.dispatch(update(payload)),
  updateBattleStatus: payload => store.dispatch(updateStatus(payload)),
  joinBattle: payload => store.dispatch(join(payload)),
  changeTurn: payload => store.dispatch(changeTurn(payload))
}
