const _ = require('lodash')
const { updatePlayer } = require('./actions')
const { selectPlayer } = require('./selectors')
const { getNFTIdsForAddress } = require('../NFT')
const { PLAYER_TYPE, PLAYER_STATE } = require('../utils/constants')
const { getUsers, updateUser, getUserProfile } = require('../user')

const getPlayers = async () => {
  const players = []

  const users = await getUsers()

  for (const user of users) {
    const player = await createPlayer(user)

    console.log('createPlayer', player.id)

    players.push(player)
  }

  return players
}

const createPlayer = async user => {
  const profile = await getUserProfile(user)
  const NFTIds = await getNFTIdsForAddress(user.address)

  return await new Promise((resolve, reject) => {
    // wait 5 second for avoid rate limit
    setTimeout(() => {
      try {
        resolve({
          id: user.id,
          user_id: user.id,
          name: user.name || profile.name,
          avatar_url: profile.avatar_url,
          address: user.address,
          socket_ids: [],
          nft_ids: NFTIds,
          exp: user.exp,
          win: user.win,
          lose: user.lose,
          type: PLAYER_TYPE.HUMAN,
          state: PLAYER_STATE.IDLE
        })
      } catch (error) {
        reject(error)
      }
    }, 5000)
  })
}

const updatePlayerUser = async (playerId, payload) => {
  console.log('updatePlayerUser', playerId, payload)

  const player = selectPlayer(playerId)

  if (player.type !== PLAYER_TYPE.HUMAN) {
    throw new Error(
      `Failed to update player user: The player type is ${player.type}`
    )
  }

  const allowedKeys = ['name', 'exp', 'win', 'lose']

  const validate = payload => {
    const validated = {}

    Object.keys(payload).forEach(key => {
      console.log(key, payload[key])

      if (!allowedKeys.includes(key)) {
        throw new Error(`${key} is not allowed`)
      }

      const value = payload[key]

      if (key === 'name' && value === '') {
        throw new Error(`${key} must be string`)
      } else if (key === 'exp' && !Number.isInteger(value)) {
        throw new Error(`${key} must be integer`)
      } else if (key === 'win' && !Number.isInteger(value)) {
        throw new Error(`${key} must be integer`)
      } else if (key === 'lose' && !Number.isInteger(value)) {
        throw new Error(`${key} must be integer`)
      }

      // convert key to camel case for user
      validated[_.camelCase(key)] = value
    })

    return validated
  }

  const userPayload = validate(payload)

  // update user
  const user = await updateUser(player.user_id, userPayload)

  const playerPayload = {}

  allowedKeys.forEach(allowedKey => {
    // copy all user latest property for alloews keys
    // convert key to snake case for player
    playerPayload[allowedKey] = user[allowedKey]
  })

  // update player
  updatePlayer({
    playerId,
    payload: playerPayload
  })
}

module.exports = {
  getPlayers,
  createPlayer,
  updatePlayerUser
}
