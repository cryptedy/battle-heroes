'use strict'

const { Server } = require('socket.io')
const { CORS_OPTIONS } = require('./utils/constants')

module.exports = server => {
  const io = new Server(server, {
    cors: CORS_OPTIONS
  })

  return io
}
