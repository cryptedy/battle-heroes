'use strict'

const { createServer } = require('http')

module.exports = app => {
  const httpServer = createServer(app)

  httpServer.once('listening', () => {
    console.log(`Listening on ${httpServer.address().port}`)
  })

  return httpServer
}
