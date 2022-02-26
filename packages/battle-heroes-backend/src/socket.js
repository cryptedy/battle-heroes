'use strict'

const chat = require('./chat')
const { Server } = require('socket.io')
const { CORS_OPTIONS } = require('./utils/constants')

module.exports = httpServer => {
  const io = new Server(httpServer, {
    cors: CORS_OPTIONS
  })

  const onConnection = socket => chat(io, socket)

  io.on('connection', onConnection)

  return io
}
