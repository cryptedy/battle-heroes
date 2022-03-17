const store = require('../store')
const { createSelector } = require('@reduxjs/toolkit')

const selectPlayers = state => state.players

const selectors = {
  selectPlayers,
  selectUserPlayer: createSelector(
    selectPlayers,
    players => user => players.find(player => player.user_id == user.id)
  ),
  selectSocketPlayer: createSelector(
    selectPlayers,
    players => socket =>
      players.find(player => player.socket_ids.includes(socket.id))
  )
}

const getState = () => store.getState().player

module.exports = {
  selectPlayers: () => selectors.selectPlayers(getState()),
  selectUserPlayer: user => selectors.selectUserPlayer(getState())(user),
  selectSocketPlayer: socket => selectors.selectSocketPlayer(getState())(socket)
}
