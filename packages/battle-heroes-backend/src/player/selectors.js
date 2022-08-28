const store = require('../store')
const { PLAYER_TYPE } = require('../utils/constants')
const { createSelector } = require('@reduxjs/toolkit')

const selectPlayers = state => state.ids.map(id => state.entities[id])

const selectors = {
  selectPlayers: createSelector(selectPlayers, players =>
    players.filter(player => player.type == PLAYER_TYPE.HUMAN)
  ),
  selectCPUPlayers: createSelector(selectPlayers, players =>
    players.filter(player => player.type == PLAYER_TYPE.CPU)
  ),
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
  selectCPUPlayers: () => selectors.selectCPUPlayers(getState()),
  selectPlayer: playerId => selectors.selectPlayer(getState())(playerId),
  selectUserPlayer: userId => selectors.selectUserPlayer(getState())(userId)
}
