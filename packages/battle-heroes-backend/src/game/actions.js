const store = require('../store')
const { add, remove, update, updatePlayer } = require('./slice').actions

module.exports = {
  addGame: payload => store.dispatch(add(payload)),
  removeGame: payload => store.dispatch(remove(payload)),
  updateGame: payload => store.dispatch(update(payload)),
  updateGamePlayer: payload => store.dispatch(updatePlayer(payload))
}
