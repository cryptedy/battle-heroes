const store = require('../store')
const { set, add, updateState, addSocket, removeSocket } =
  require('./slice').actions

module.exports = {
  setPlayers: payload => store.dispatch(set(payload)),
  addPlayer: payload => store.dispatch(add(payload)),
  updatePlayerState: payload => store.dispatch(updateState(payload)),
  addPlayerSocket: payload => store.dispatch(addSocket(payload)),
  removePlayerSocket: payload => store.dispatch(removeSocket(payload))
}
