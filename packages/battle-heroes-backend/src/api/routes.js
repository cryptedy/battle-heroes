const { Router } = require('express')
const { selectNFTs } = require('../NFT/selectors')
const { selectPlayers } = require('../player/selectors')

const router = Router()

router.get('/nfts', async (req, res) => {
  try {
    res.json(selectNFTs())
  } catch (error) {
    res.json({})
  }
})

router.get('/players', async (req, res) => {
  try {
    res.json(selectPlayers())
  } catch (error) {
    res.json({})
  }
})

module.exports = router
