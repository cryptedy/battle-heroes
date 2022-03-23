const store = require('../store')

const selectors = {
  selectMessages: state => state.ids.map(id => state.entities[id])
}

const getState = () => store.getState().message

module.exports = {
  selectMessages: () => selectors.selectMessages(getState())
}
