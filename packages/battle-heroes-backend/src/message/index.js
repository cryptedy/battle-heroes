const moment = require('moment')
const { nanoid } = require('@reduxjs/toolkit')

const createMessage = (text, player) => {
  return {
    id: nanoid(),
    player,
    text,
    posted_at: moment().unix()
  }
}

module.exports = {
  createMessage
}
