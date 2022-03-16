const store = require('../store')
const { messageSlice } = require('./')

const actions = {}

Object.keys(messageSlice.actions).forEach(key => {
  actions[key] = (...arg) => store.dispatch(messageSlice.actions[key](...arg))
})

module.exports = actions
