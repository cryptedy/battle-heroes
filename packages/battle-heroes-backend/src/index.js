const api = require('./api')
const cors = require('cors')
const express = require('express')
const { getNFTs } = require('./NFT')
const { Server } = require('socket.io')
const Moralis = require('moralis/node')
const { createServer } = require('http')
const { GameManager } = require('./game')
const { getPlayers } = require('./player')
const { selectNFTs } = require('./NFT/selectors')
const { selectGames } = require('./game/selectors')
const { addNFT, setNFTs } = require('./NFT/actions')
const { selectBattles } = require('./battle/selectors')
const {
  selectPlayer,
  selectPlayers,
  selectCPUPlayers
} = require('./player/selectors')
const { setPlayers, addPlayer } = require('./player/actions')
const {
  PORT,
  MONSTERS,
  PLAYER_TYPE,
  FRONTEND_URL,
  PLAYER_STATE
} = require('./utils/constants')

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

      console.log(NFTs.length)

      Object.keys(MONSTERS).forEach(key => {
        const monster = MONSTERS[key]
        monster.id = NFTs.length + monster.id
        monster.image_url = `/images/monsters/${monster.token_id}.png`

        addNFT(monster)
      })
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

    const monsterNFTIds = selectNFTs()
      .filter(NFT => NFT.collection_id === 0)
      .map(monster => monster.id)

    const createCPUPlayer = (id, name, NFTIds) => {
      return {
        id,
        user_id: id,
        name,
        avatar_url: '',
        address: '',
        socket_ids: [],
        nft_ids: NFTIds,
        exp: 0,
        win: 0,
        lose: 0,
        type: PLAYER_TYPE.CPU,
        state: PLAYER_STATE.IDLE
      }
    }

    monsterNFTIds.forEach((NFTId, index) => {
      const id = index + 1
      const name = `Pixel Monsters #${id}`
      const NFTIds = [NFTId]

      const CPUPlayer = createCPUPlayer(id, name, NFTIds)

      addPlayer(CPUPlayer)
    })

    selectPlayers().forEach((player, index) => {
      const id = monsterNFTIds.length + (index + 1)
      const name = `CPU - ${player.name}`
      const NFTIds = player.nft_ids

      const CPUPlayer = createCPUPlayer(id, name, NFTIds)

      addPlayer(CPUPlayer)
    })

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
