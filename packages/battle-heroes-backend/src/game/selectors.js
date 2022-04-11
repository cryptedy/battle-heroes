const store = require('../store')
const { createSelector } = require('@reduxjs/toolkit')

const selectGames = state => state.ids.map(id => state.entities[id])

const selectors = {
  selectGames,
  selectGame: createSelector(
    selectGames,
    games => gameId => games.find(game => game.id === gameId)
  ),
  selectBattleGame: createSelector(
    selectGames,
    games => battleId => games.find(game => game.battle_id === battleId)
  )
}

const getState = () => store.getState().game

module.exports = {
  selectGames: () => selectors.selectGames(getState()),
  selectGame: gameId => selectors.selectGame(getState())(gameId),
  selectBattleGame: battleId => selectors.selectBattleGame(getState())(battleId)
}
