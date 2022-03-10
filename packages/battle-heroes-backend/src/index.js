const express = require('express')
const cors = require('cors')
const { createServer } = require('http')
const { Server } = require('socket.io')
const routes = require('./routes')
const game = require('./game')
const { FRONTEND_URL, PORT } = require('./constants')

const corsOptions = {
  origin: new URL(FRONTEND_URL).origin
}

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
