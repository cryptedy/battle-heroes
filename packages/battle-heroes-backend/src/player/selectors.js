const store = require('../store')
const { playerSelectors } = require('./')

const getState = () => store.getState().player

const selectors = {
  selectPlayers: () => playerSelectors.selectPlayers(getState()),
  selectPlayerByUser: user =>
    playerSelectors.selectPlayerByUser(getState())(user),
  selectPlayerBySocket: socket =>
    playerSelectors.selectPlayerBySocket(getState())(socket)
}

module.exports = selectors
