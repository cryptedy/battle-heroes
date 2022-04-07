const moment = require('moment')
const { v4: uuidv4 } = require('uuid')

const createMessage = (text, player) => {
  return {
    id: uuidv4(),
    player_id: player.id,
    text,
    posted_at: moment().unix()
  }
}

module.exports = {
  createMessage
}
