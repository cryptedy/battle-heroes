const store = require('../store')
const { playerSelectors } = require('./')

const getState = () => store.getState().player

const selectors = {
  all: () => playerSelectors.selectPlayers(getState()),
  findByUser: user => playerSelectors.selectPlayerByUser(getState())(user),
  findBySocket: socket =>
    playerSelectors.selectPlayerBySocket(getState())(socket)
}

module.exports = selectors
