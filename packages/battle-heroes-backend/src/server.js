'use strict'

const { createServer } = require('http')
const socket = require('./socket')

module.exports = app => {
  const server = createServer(app)

  const io = socket(server)

  const users = []
  const bot = {
    name: 'bot',
    image_url: ''
  }
  const findUser = socketId => users.find(user => user.socketId === socketId)

  io.on('connection', socket => {
    socket.emit('message', {
      user: bot,
      message: 'Welcome to chat!'
    })

    socket.on('join', user => {
      user.socketId = socket.id

      users.push(user)

      socket.broadcast.emit('message', {
        user: bot,
        message: `${user.name} user join chat`
      })

      io.emit('users', users)
    })

    socket.on('chatMessage', chatMessage => {
      io.emit('message', {
        user: findUser(socket.id),
        message: chatMessage
      })
    })

    socket.on('disconnect', () => {
      const index = users.findIndex(user => user.socketId === socket.id)

      if (index != -1) {
        const user = users.splice(index, 1)[0]

        io.emit('message', {
          user: bot,
          message: `${user.name} user has left the chat`
        })

        io.emit('users', users)
      }
    })
  })

  server.once('listening', () => {
    console.log(`Listening on ${server.address().port}`)
  })

  return server
}
