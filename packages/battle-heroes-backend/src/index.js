const api = require('./api')
const cors = require('cors')
const express = require('express')
const { getNFTs } = require('./NFT')
const { Server } = require('socket.io')
const Moralis = require('moralis/node')
const { createServer } = require('http')
const { gameManager } = require('./game')
const { getPlayers } = require('./player')
const { setNFTs } = require('./NFT/actions')
const { setPlayers } = require('./player/actions')
const { selectPlayers } = require('./player/selectors')
const { FRONTEND_URL, PORT } = require('./utils/constants')

Moralis.start({
  serverUrl: process.env.MORALIS_SERVER_URL,
  appId: process.env.MORALIS_APPLICATION_ID
})

const corsOptions = {
  origin: new URL(FRONTEND_URL).origin
}

const main = async () => {
  try {
    const NFTs = await getNFTs()
    setNFTs(NFTs)
  } catch (error) {
    console.log(error)

    process.exit(1)
  }

  const app = express()
  const server = createServer(app)

  const isServerReady = () => server.listening && selectPlayers().length > 0

  app.use(cors(corsOptions))
  app.use(express.json())
  app.use((req, res, next) => {
    if (!isServerReady()) {
      res.status(503)
    } else {
      next()
    }
  })

  app.use(api)

  const io = new Server(server, {
    cors: corsOptions
  })

  io.use((socket, next) => {
    if (!isServerReady()) {
      next(new Error('The server is under maintenance'))
    } else {
      next()
    }
  })

  io.on('connection', async socket => {
    console.log('onConnection', socket.id)

    process.on('uncaughtException', error => {
      const { message, stack } = error

      io.to(socket.id).emit

      socket.emit('error', { message, stack })
    })

    process.on('unhandledRejection', (reason, promise) => {
      socket.emit('error', { message: reason, stack: promise })
    })

    gameManager(io, socket)
  })

  server.listen(PORT, async () => {
    console.log(`Listening on ${server.address().port}`)

    try {
      const players = await getPlayers()

      setPlayers(players)
    } catch (error) {
      console.log(error)

      process.exit(1)
    }
  })
}

main()
