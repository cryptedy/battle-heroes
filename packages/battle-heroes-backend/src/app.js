'use strict'

const express = require('express')
const cors = require('cors')
const { CORS_OPTIONS } = require('./utils/constants')

const app = express()

app.use(cors(CORS_OPTIONS)).use('/api', require('./routes/api'))

module.exports = app
