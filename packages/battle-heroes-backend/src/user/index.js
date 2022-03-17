const axios = require('axios')
const Moralis = require('moralis/node')
const { OPENSEA_API_URL } = require('../utils/constants')

const getUsers = async () => {
  const moralisUsers = await getMoralisUsers()

  return moralisUsers.map(user => createUser(user))
}

// define following Morales cloud functions in advance.
// Moralis.Cloud.define('Users', async () => {
//   const query = new Moralis.Query('User')
//   return await query.find({ useMasterKey: true })
// })
const getMoralisUsers = async () => {
  const moralisUsers = await Moralis.Cloud.run('Users')

  return moralisUsers.filter(user => user.get('ethAddress') !== undefined)
}

const createUser = moralisUser => {
  return {
    id: moralisUser.id,
    address: moralisUser.get('ethAddress')
  }
}

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
  getUsers,
  getUserProfile
}
