const express = require('express')
const cors = require('cors')
const { createServer } = require('http')
const { Server } = require('socket.io')
const Moralis = require('moralis/node')
const routes = require('./routes')
const game = require('./game')
const store = require('./store')
const { getNFTs } = require('./NFT')
const { COLLECTIONS, FRONTEND_URL, PORT } = require('./constants')

Moralis.start({
  serverUrl: process.env.MORALIS_SERVER_URL,
  appId: process.env.MORALIS_APPLICATION_ID
})

const corsOptions = {
  origin: new URL(FRONTEND_URL).origin
}

const main = async () => {
  const NFTs = {}

  for (const collectionId of Object.keys(COLLECTIONS)) {
    try {
      NFTs[collectionId] = await getNFTs(collectionId)
    } catch (error) {
      throw new Error(error)
    }
  }

  store.dispatch({
    type: 'SET_NFTs',
    payload: NFTs
  })

  const app = express()

  app.use(cors(corsOptions)).use('/', routes)

  const httpServer = createServer(app)

  const io = new Server(httpServer, {
    cors: corsOptions
  })

  const onConnection = socket => game(io, socket)

  io.on('connection', onConnection)

  httpServer.listen(PORT, () => {
    console.log(`Listening on ${httpServer.address().port}`)
  })
}

main()
