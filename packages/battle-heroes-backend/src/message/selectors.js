const store = require('../store')

const selectors = {
  selectMessages: state => state.messages
}

const getState = () => store.getState().message

module.exports = {
  selectMessages: () => selectors.selectMessages(getState())
}
