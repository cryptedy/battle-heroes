const { Router } = require('express')
const { selectNFTs } = require('../NFT/selectors')
const { selectPlayers } = require('../player/selectors')

const router = Router()

router.get('/collections/:id/nfts', async (req, res) => {
  const NFTs = selectNFTs()

  try {
    res.json(NFTs[req.params.id])
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
