const axios = require('axios')
const { OPENSEA_API_URL } = require('../utils/constants')

const getUserProfile = async user => {
  const profile = {
    name: 'Unnamed',
    avatar_url: ''
  }

  try {
    const { data: openSeaUser } = await axios.get(
      `${OPENSEA_API_URL}/user/${user.address}`
    )

    const { account } = openSeaUser

    profile.name = openSeaUser.username || 'Unnamed'
    profile.avatar_url = account.profile_img_url

    return profile
  } catch (error) {
    return profile
  }
}

module.exports = {
  getUserProfile
}
