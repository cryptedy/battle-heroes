const api = require('./api')
const cors = require('cors')
const express = require('express')
const { getNFTs } = require('./NFT')
const { Server } = require('socket.io')
const Moralis = require('moralis/node')
const { createServer } = require('http')
const { GameManager } = require('./game')
const { getPlayers } = require('./player')
const { setNFTs } = require('./NFT/actions')
const { setPlayers } = require('./player/actions')
const { FRONTEND_URL, PORT } = require('./utils/constants')

Moralis.start({
  serverUrl: process.env.MORALIS_SERVER_URL,
  appId: process.env.MORALIS_APPLICATION_ID
})

const corsOptions = {
  origin: new URL(FRONTEND_URL).origin
}

const main = async () => {
  let isReady = false

  const app = express()
  const server = createServer(app)

  const isServerReady = () => server.listening && isReady

  app.use(cors(corsOptions))
  app.use(express.json())
  app.use((req, res, next) => {
    if (!isServerReady()) {
      res.status(503).json({
        message: 'The server is under maintenance'
      })
    } else {
      next()
    }
  })
  app.use(api)

  const io = new Server(server, {
    path: '/socket',
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

    const gameManager = new GameManager(io, socket)

    gameManager.listen(error => {
      if (error) throw new Error(error)

      console.log(`Game manager listen for ${socket.id}`)
    })
  })

  server.listen(PORT, async error => {
    if (error) throw new Error(error)

    console.log(`Server listening on ${server.address().port}`)

    try {
      const NFTs = await getNFTs()
      setNFTs(NFTs)
    } catch (error) {
      console.error(error)

      process.exit(1)
    }

    try {
      const players = await getPlayers()

      setPlayers(players)
    } catch (error) {
      console.error(error)

      process.exit(1)
    }

    isReady = true
  })
}

process.on('uncaughtException', error => console.error(error))

process.on('unhandledRejection', (reason, promise) =>
  console.error(reason, promise)
)

try {
  main()
} catch (error) {
  console.error(error)
}
