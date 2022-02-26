'use strict'

const app = require('./app')
const httpServer = require('./server')(app)
require('./socket')(httpServer)
const { PORT } = require('./utils/constants')

httpServer.listen(PORT)
