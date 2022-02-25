'use strict'

const app = require('./app')
const server = require('./server')(app)
const { PORT } = require('./utils/constants')

server.listen(PORT)
