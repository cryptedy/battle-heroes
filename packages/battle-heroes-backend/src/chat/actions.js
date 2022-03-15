const store = require('../store')
const { chatSlice } = require('./')

const actions = {}

Object.keys(chatSlice.actions).forEach(key => {
  actions[key] = (...arg) => store.dispatch(chatSlice.actions[key](...arg))
})

module.exports = actions
