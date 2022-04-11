const store = require('../store')
const { createSelector } = require('@reduxjs/toolkit')

const selectPlayers = state => state.ids.map(id => state.entities[id])

const selectors = {
  selectPlayers,
  selectPlayer: createSelector(
    selectPlayers,
    players => playerId => players.find(player => player.id == playerId)
  ),
  selectUserPlayer: createSelector(
    selectPlayers,
    players => userId => players.find(player => player.user_id == userId)
  )
}

const getState = () => store.getState().player

module.exports = {
  selectPlayers: () => selectors.selectPlayers(getState()),
  selectPlayer: playerId => selectors.selectPlayer(getState())(playerId),
  selectUserPlayer: userId => selectors.selectUserPlayer(getState())(userId)
}
