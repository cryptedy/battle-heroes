'use strict'

const users = []

const bot = {
  name: 'bot',
  image_url: ''
}

const findUser = socketId => users.find(user => user.socketId === socketId)

module.exports = (io, socket) => {
  socket.emit('message', {
    user: bot,
    message: 'Welcome to chat!'
  })

  const onJoin = user => {
    user.socketId = socket.id

    users.push(user)

    socket.broadcast.emit('message', {
      user: bot,
      message: `${user.name} user join chat`
    })

    io.emit('users', users)
  }

  const onChatMessage = message => {
    io.emit('message', {
      user: findUser(socket.id),
      message: message
    })
  }

  const onDisconnect = () => {
    const index = users.findIndex(user => user.socketId === socket.id)

    if (index != -1) {
      const user = users.splice(index, 1)[0]

      io.emit('message', {
        user: bot,
        message: `${user.name} user has left the chat`
      })

      io.emit('users', users)
    }
  }

  socket.on('join', onJoin)
  socket.on('chatMessage', onChatMessage)
  socket.on('disconnect', onDisconnect)
}
