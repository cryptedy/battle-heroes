const store = require('../store')
const { createSelector } = require('@reduxjs/toolkit')

const selectBattles = state => state.ids.map(id => state.entities[id])

const selectors = {
  selectBattles,
  selectBattle: createSelector(
    selectBattles,
    battles => battleId => battles.find(battle => battle.id === battleId)
  )
}

const getState = () => store.getState().battle

module.exports = {
  selectBattles: () => selectors.selectBattles(getState()),
  selectBattle: battleId => selectors.selectBattle(getState())(battleId)
}
