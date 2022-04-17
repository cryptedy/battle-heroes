const store = require('../store')
const { createSelector } = require('@reduxjs/toolkit')

const selectMessages = state => state.ids.map(id => state.entities[id])

const selectors = {
  selectMessages,
  selectMessage: createSelector(
    selectMessages,
    messages => messageId => messages.find(message => message.id === messageId)
  )
}

const getState = () => store.getState().message

module.exports = {
  selectMessages: () => selectors.selectMessages(getState()),
  selectMessage: messageId => selectors.selectMessage(getState())(messageId)
}
