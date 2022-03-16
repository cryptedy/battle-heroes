const store = require('../store')
const { messageSelectors } = require('./')

const getState = () => store.getState().message

const selectors = {
  selectMessages: () => messageSelectors.selectMessages(getState())
}

module.exports = selectors
