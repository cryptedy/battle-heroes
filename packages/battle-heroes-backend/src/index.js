const express = require('express')
const cors = require('cors')
const app = express()
const server = require('http').createServer(app)
const axios = require('axios')
const { PORT, CORS_OPTIONS, OPENSEA_API_URL } = require('./utils/constants')
const io = require('socket.io')(server, { cors: CORS_OPTIONS })

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

app.use(cors(CORS_OPTIONS))

app.get('/api/user/:address', async (req, res) => {
  const profile = {
    name: null,
    image_url: null
  }

  try {
    const { data: user } = await axios.get(
      `${OPENSEA_API_URL}/user/${req.params.address}`
    )

    const { account } = user

    profile.name = user.username
    profile.image_url = account.profile_img_url

    res.json(profile)
  } catch (error) {
    res.json(profile)
  }
})

server.listen(PORT, () => {
  console.log(`Listening on ${server.address().port}`)
})
