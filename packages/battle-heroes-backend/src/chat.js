'use strict'

const users = []

const bot = {
  name: 'bot',
  image_url: ''
}

const findUser = socketId => users.find(user => user.socketId === socketId)

module.exports = (io, socket) => {
  socket.emit('chat:message', {
    user: bot,
    text: 'Welcome to chat!'
  })

  const onJoin = user => {
    user.socketId = socket.id

    users.push(user)

    socket.broadcast.emit('chat:message', {
      user: bot,
      text: `${user.name} user join chat`
    })

    io.emit('chat:users', users)
  }

  const onNewMessage = message => {
    io.emit('chat:message', {
      user: findUser(socket.id),
      text: message
    })
  }

  const onDisconnect = () => {
    const index = users.findIndex(user => user.socketId === socket.id)

    if (index != -1) {
      const user = users.splice(index, 1)[0]

      io.emit('chat:message', {
        user: bot,
        text: `${user.name} user has left the chat`
      })

      io.emit('chat:users', users)
    }
  }

  socket.on('chat:join', onJoin)
  socket.on('chat:newMessage', onNewMessage)
  socket.on('disconnect', onDisconnect)
}
