const store = require('../store')
const { set, add, update } = require('./slice').actions

module.exports = {
  setPlayers: payload => store.dispatch(set(payload)),
  addPlayer: payload => store.dispatch(add(payload)),
  updatePlayer: payload => store.dispatch(update(payload))
}
