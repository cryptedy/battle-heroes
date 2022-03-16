const store = require('../store')
const gameActions = require('./slice').actions

const actions = {}

Object.keys(gameActions).forEach(key => {
  if (typeof gameActions[key] !== 'function') {
    throw new Error(`The action '${key}' must be a function`)
  }

  actions[key] = (...arg) => store.dispatch(gameActions[key](...arg))
})

module.exports = actions
