const store = require('../store')

const selectors = {
  selectCollections: state => state.ids.map(id => state.entities[id])
}

const getState = () => store.getState().collection

module.exports = {
  selectCollections: () => selectors.selectCollections(getState())
}
