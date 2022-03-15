const { Router } = require('express')
const router = Router()
const NFTSelectors = require('../NFT/selectors')

router.get('/collections/:id/nfts', async (req, res) => {
  const NFTs = NFTSelectors.all()

  try {
    res.json(NFTs[req.params.id])
  } catch (error) {
    res.json({})
  }
})

module.exports = router
