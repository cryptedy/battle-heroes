const store = require('../store')
const { playerSlice } = require('./')

const actions = {}

Object.keys(playerSlice.actions).forEach(key => {
  actions[key] = (...arg) => store.dispatch(playerSlice.actions[key](...arg))
})

module.exports = actions
