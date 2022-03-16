const store = require('../store')
const playerActions = require('./slice').actions

const actions = {}

Object.keys(playerActions).forEach(key => {
  if (typeof playerActions[key] !== 'function') {
    throw new Error(`The action '${key}' must be a function`)
  }

  actions[key] = (...arg) => store.dispatch(playerActions[key](...arg))
})

module.exports = actions
