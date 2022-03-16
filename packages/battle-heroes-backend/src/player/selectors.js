const store = require('../store')
const { createSelector } = require('@reduxjs/toolkit')

const selectPlayers = state => state.players

const selectors = {
  selectPlayers,
  selectPlayerBySocket: createSelector(
    selectPlayers,
    players => socket =>
      players.find(player => player.socket_ids.includes(socket.id))
  ),
  selectPlayerByUser: createSelector(
    selectPlayers,
    players => user => players.find(player => player.user_id == user.id)
  )
}

const getState = () => store.getState().player

module.exports = {
  selectPlayers: () => selectors.selectPlayers(getState()),
  selectPlayerByUser: user => selectors.selectPlayerByUser(getState())(user),
  selectPlayerBySocket: socket =>
    selectors.selectPlayerBySocket(getState())(socket)
}
