const { Router } = require('express')
const axios = require('axios')
const { OPENSEA_API_URL } = require('../../utils/constants')

const router = Router()

router.get('/:address', async (req, res) => {
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

module.exports = router
