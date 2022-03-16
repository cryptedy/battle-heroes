const store = require('../store')
const { playerSlice } = require('./')

const actions = {}

Object.keys(playerSlice.actions).forEach(key => {
  if (typeof playerSlice.actions[key] !== 'function') {
    throw new Error(`The action '${key}' must be a function`)
  }

  actions[key] = (...arg) => store.dispatch(playerSlice.actions[key](...arg))
})

module.exports = actions
