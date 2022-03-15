const axios = require('axios')
const { getTokenIdsForAddress } = require('../NFT')
const { COLLECTIONS, OPENSEA_API_URL } = require('../utils/constants')

const getUserProfile = async user => {
  const profile = {
    name: 'NO NAME',
    avatar_url: ''
  }

  try {
    const { data: openSeaUser } = await axios.get(
      `${OPENSEA_API_URL}/user/${user.address}`
    )

    const { account } = openSeaUser

    profile.name = openSeaUser.username
    profile.avatar_url = account.profile_img_url

    return profile
  } catch (error) {
    return profile
  }
}

const getUserTokenIds = async user => {
  const tokenIds = {}

  for (const collection of COLLECTIONS) {
    tokenIds[collection.id] = []

    try {
      tokenIds[collection.id] = await getTokenIdsForAddress(
        collection.id,
        user.address
      )
    } catch (error) {
      console.log(error)
    }
  }

  return tokenIds
}

module.exports = {
  getUserProfile,
  getUserTokenIds
}
