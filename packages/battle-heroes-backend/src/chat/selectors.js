const store = require('../store')
const { chatSelectors } = require('./')

const getState = () => store.getState().chat

const selectors = {
  allMessages: () => chatSelectors.selectMessages(getState())
}

module.exports = selectors
