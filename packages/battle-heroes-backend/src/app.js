'use strict'

const cors = require('cors')
const express = require('express')
const routes = require('./routes')
const { CORS_OPTIONS } = require('./utils/constants')

const app = express()

app.use(cors(CORS_OPTIONS)).use('/', routes)

module.exports = app
