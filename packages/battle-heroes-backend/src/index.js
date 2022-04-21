const express = require('express')
const cors = require('cors')
const { createServer } = require('http')
const { Server } = require('socket.io')
const Moralis = require('moralis/node')
const api = require('./api')
const { getNFTs } = require('./NFT')
const { gameManager } = require('./game')
const { getPlayers } = require('./player')
const { setNFTs } = require('./NFT/actions')
const { setPlayers } = require('./player/actions')
const { FRONTEND_URL, PORT } = require('./utils/constants')

let isReady = false

Moralis.start({
  serverUrl: process.env.MORALIS_SERVER_URL,
  appId: process.env.MORALIS_APPLICATION_ID
})

const corsOptions = {
  origin: new URL(FRONTEND_URL).origin
}

// DEBUG
// const store = require('./store')
// const { selectPlayers } = require('./player/selectors')
// const { selectBattles } = require('./battle/selectors')
// const { selectGames } = require('./game/selectors')
// setInterval(() => {
//   const state = store.getState()
//   console.log(`Players ${state.player.ids.length}`)
//   console.log(`Battles ${state.battle.ids.length}`)
//   console.log(selectPlayers())
//   console.log(selectBattles())
//   console.log(selectGames())
//   selectBattles().forEach(battle => {
//     console.log('battle', battle)
//   })
//   selectGames().forEach(game => {
//     console.log('game', game)
//   })
//   console.log(state.battle)
// }, 5000)

const main = async () => {
  try {
    const NFTs = await getNFTs()
    setNFTs(NFTs)
  } catch (error) {
    console.log(error)

    process.exit(1)
  }

  const app = express()

  app.use(cors(corsOptions))
  app.use(express.json())
  app.use((req, res, next) => {
    if (!isReady) {
      res.status(503)
    } else {
      next()
    }
  })

  app.use(api)

  const server = createServer(app)

  const io = new Server(server, {
    cors: corsOptions
  })

  io.use((socket, next) => {
    if (!isReady) {
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

    process.on('unhandledRejection', (reason, p) => {
      const message = reason
      const stack = p

      socket.emit('error', { message, stack })
    })

    gameManager(io, socket)
  })

  server.listen(PORT, async () => {
    console.log(`Listening on ${server.address().port}`)

    try {
      const players = await getPlayers()

      setPlayers(players)

      isReady = true
    } catch (error) {
      console.log(error)

      process.exit(1)
    }
  })
}

main()
