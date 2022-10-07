const { createSelector } = require('@reduxjs/toolkit')
const store = require('../store')

const selectContracts = state => state

const selectors = {
  selectContracts,
  selectProvider: createSelector(
    selectContracts,
    contracts => contracts.provider
  ),
  selectSigner: createSelector(selectContracts, contracts => contracts.signer),
  selectVault: createSelector(selectContracts, contracts => contracts.vault),
  selectExchange: createSelector(
    selectContracts,
    contracts => contracts.exchange
  ),
  selectERC20: createSelector(selectContracts, contracts => contracts.erc20)
}

const getState = () => store.getState().contract

module.exports = {
  selectContracts: () => selectors.selectContracts(getState()),
  selectProvider: () => selectors.selectProvider(getState()),
  selectSigner: () => selectors.selectSigner(getState()),
  selectVault: () => selectors.selectVault(getState()),
  selectExchange: () => selectors.selectExchange(getState()),
  selectERC20: () => selectors.selectERC20(getState())
}
