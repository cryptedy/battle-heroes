const constants = require('../../../battle-heroes-utils/constants')

const PORT = process.env.PORT || 3000
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:8080'
const OPENSEA_API_URL = 'https://api.opensea.io'

module.exports = Object.freeze({
  ...constants,
  PORT,
  FRONTEND_URL,
  OPENSEA_API_URL
})
