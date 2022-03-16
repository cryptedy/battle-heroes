const store = require('../store')
const NFTActions = require('./slice').actions

const actions = {}

Object.keys(NFTActions).forEach(key => {
  actions[key] = (...arg) => store.dispatch(NFTActions[key](...arg))
})

module.exports = actions
