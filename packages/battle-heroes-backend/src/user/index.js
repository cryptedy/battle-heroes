const axios = require('axios')
const Moralis = require('moralis/node')
const { OPENSEA_API_URL } = require('../utils/constants')

const getUsers = async () => {
  const moralisUsers = await getMoralisUsers()

  return moralisUsers.map(user => createUser(user))
}

const findUser = async userId => {
  const moralisUser = await findMoralisUser(userId)

  return createUser(moralisUser)
}

const updateUser = async (userId, payload) => {
  console.log('updateUser', userId, payload)

  const moralisUser = await updateMoralisUser(userId, payload)

  return createUser(moralisUser)
}

const createUser = moralisUser => {
  return {
    id: moralisUser.id,
    address: moralisUser.get('ethAddress'),
    exp: moralisUser.get('exp') || 0,
    win: moralisUser.get('win') || 0,
    lose: moralisUser.get('lose') || 0
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

const getMoralisUsers = async () => {
  const moralisUsers = await Moralis.Cloud.run('getUsers')

  return moralisUsers.filter(
    moralisUser => moralisUser.get('ethAddress') !== undefined
  )
}

const findMoralisUser = async userId => {
  console.log('findMoralisUser', userId)

  const moralisUser = await Moralis.Cloud.run('findUser', { objectId: userId })

  return moralisUser
}

const updateMoralisUser = async (userId, payload) => {
  console.log('updateMoralisUser', userId, payload)

  const moralisUser = await Moralis.Cloud.run('updateUser', {
    objectId: userId,
    payload
  })

  return moralisUser
}

/*
Moralis.Cloud.define('getUsers', async () => {
  const query = new Moralis.Query('User')
  return await query.find({ useMasterKey: true })
})

Moralis.Cloud.define('findUser', async request => {
  const { objectId } = request.params
  const query = new Moralis.Query('User')
  query.equalTo('objectId', objectId)
  return await query.first({ useMasterKey: true })
})

Moralis.Cloud.define('updateUser', async request => {
  const { objectId, payload } = request.params
  const query = new Moralis.Query('User')
  query.equalTo('objectId', objectId)
  const user = await query.first({ useMasterKey: true })
  const { type, value } = payload
  user.set(type, value)
  await user.save(null, { useMasterKey: true })
  return user
})
*/

module.exports = {
  getUsers,
  findUser,
  updateUser,
  getUserProfile
}
