const store = require('../store')
const { set, add, update, addSocket, removeSocket } = require('./slice').actions

module.exports = {
  setPlayers: payload => store.dispatch(set(payload)),
  addPlayer: payload => store.dispatch(add(payload)),
  updatePlayer: payload => store.dispatch(update(payload)),
  addPlayerSocket: payload => store.dispatch(addSocket(payload)),
  removePlayerSocket: payload => store.dispatch(removeSocket(payload))
}
