const express = require('express')
const cors = require('cors')
const { createServer } = require('http')
const { Server } = require('socket.io')
const Moralis = require('moralis/node')
const api = require('./api')
const { getNFTs } = require('./NFT')
const { setNFTs } = require('./NFT/actions')
const { getPlayers } = require('./player')
const { setPlayers } = require('./player/actions')
const { gameManager } = require('./game')
const { FRONTEND_URL, PORT } = require('./utils/constants')

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
const { selectBattles } = require('./battle/selectors')
setInterval(() => {
  // const state = store.getState()
  // console.log(`Players ${state.player.ids.length}`)
  // console.log(`Battles ${state.battle.ids.length}`)
  // console.log(selectPlayers())
  console.log(selectBattles())
  // console.log(state.battle)
}, 5000)

const main = async () => {
  try {
    const NFTs = await getNFTs()
    setNFTs(NFTs)

    const players = await getPlayers()
    setPlayers(players)
  } catch (error) {
    console.log(error)

    process.exit(1)
  }

  const app = express()
  app.use(cors(corsOptions)).use(api)

  const server = createServer(app)

  const io = new Server(server, {
    cors: corsOptions
  })

  io.on('connection', socket => {
    console.log('onConnection', socket.id)

    gameManager(io, socket)
  })

  server.listen(PORT, () => {
    console.log(`Listening on ${server.address().port}`)
  })
}

main()
