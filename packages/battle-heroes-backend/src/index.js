const express = require('express')
const cors = require('cors')
const app = express()
const server = require('http').createServer(app)
const axios = require('axios')

const { OPENSEA_API_URL } = require('./utils/constants')

const port = process.env.PORT || 3000
const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:8080'

app.use(
  cors({
    origin: frontendUrl
  })
)

app.get('/api/user/:address', async (req, res) => {
  const profile = {
    name: null,
    image_url: null
  }

  try {
    const { data: user } = await axios.get(
      `${OPENSEA_API_URL}/user/${req.params.address}`
    )

    const { account } = user

    profile.name = user.username
    profile.image_url = account.profile_img_url

    res.json(profile)
  } catch (error) {
    res.json(profile)
  }
})

server.listen(port, () => {
  console.log(`Listening on ${server.address().port}`)
})
