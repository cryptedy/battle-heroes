const constants = require('../../../battle-heroes-utils/constants')

const PORT = process.env.PORT || 3000
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:8080'
const OPENSEA_API_URL = 'https://api.opensea.io'
const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL
const DISCORD_POST_TYPE = Object.freeze({
  BATTLE_CREATED: 'BATTLE_CREATED',
  BATTLE_MATCHED: 'BATTLE_MATCHED',
  BATTLE_ENDED: 'BATTLE_ENDED'
})

module.exports = Object.freeze({
  ...constants,
  PORT,
  FRONTEND_URL,
  OPENSEA_API_URL,
  DISCORD_WEBHOOK_URL,
  DISCORD_POST_TYPE
})
