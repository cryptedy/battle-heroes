'use strict'

const express = require('express')
const cors = require('cors')
const { CORS_OPTIONS } = require('./utils/constants')

const app = express()

app.use(cors(CORS_OPTIONS)).use('/', require('./routes'))

module.exports = app
