const store = require('../store')
const { createSelector } = require('@reduxjs/toolkit')

const selectGames = state => state.games

const selectors = {
  selectGames,
  selectPlayerGame: createSelector(
    selectGames,
    games => player => games.find(game => game.player_ids.includes(player.id))
  )
}

const getState = () => store.getState().game

module.exports = {
  selectGames: () => selectors.selectGames(getState()),
  selectPlayerGame: player => selectors.selectPlayerGame(getState())(player)
}
