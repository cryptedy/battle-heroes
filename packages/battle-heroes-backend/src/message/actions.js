const store = require('../store')
const messageActions = require('./slice').actions

const actions = {}

Object.keys(messageActions).forEach(key => {
  actions[key] = (...arg) => store.dispatch(messageActions[key](...arg))
})

module.exports = actions
