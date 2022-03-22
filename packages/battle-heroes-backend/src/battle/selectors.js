const store = require('../store')
const { createSelector } = require('@reduxjs/toolkit')

const selectBattles = state => state.battles

const selectors = {
  selectBattles,
  selectPlayerBattle: createSelector(
    selectBattles,
    battles => player => battles.find(battle => battle.player.id === player.id)
  )
}

const getState = () => store.getState().battle

module.exports = {
  selectBattles: () => selectors.selectBattles(getState()),
  selectPlayerBattle: player => selectors.selectPlayerBattle(getState())(player)
}
