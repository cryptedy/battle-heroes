const { Router } = require('express')
const store = require('./store')

const router = Router()

router.get('/api/collections/:id/nfts', async (req, res) => {
  try {
    const { NFTs } = store.getState()

    res.json(NFTs[req.params.id])
  } catch (error) {
    res.json({})
  }
})

module.exports = router
