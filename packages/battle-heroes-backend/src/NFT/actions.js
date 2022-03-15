const store = require('../store')
const { NFTSlice } = require('./')

const actions = {}

Object.keys(NFTSlice.actions).forEach(key => {
  actions[key] = (...arg) => store.dispatch(NFTSlice.actions[key](...arg))
})

module.exports = actions
