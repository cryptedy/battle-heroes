'use strict'

const express = require('express')
const app = express()
const server = require('http').createServer(app)

app.get('/', (req, res) => {
  res.send('Hello World!')
})

server.listen(8081, () => {
  console.log(`Listening on ${server.address().port}`)
})
