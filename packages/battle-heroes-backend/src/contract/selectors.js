const store = require('../store')

const selectors = {
  selectContracts: state => state
}

const getState = () => store.getState().contract

module.exports = {
  selectContracts: () => selectors.selectContracts(getState())
}
