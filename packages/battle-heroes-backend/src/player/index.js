const { getUsers } = require('../user')
const { getUserProfile } = require('../user')
const { getTokenIdsForAddress } = require('../NFT')
const { PLAYER_STATE } = require('../utils/constants')

const getPlayers = async () => {
  const players = []

  const users = await getUsers()

  for (const user of users) {
    const player = await createPlayer(user)

    players.push(player)
  }

  return players
}

const createPlayer = async user => {
  const profile = await getUserProfile(user)
  const tokenIds = await getTokenIdsForAddress(user.address)

  return {
    id: user.id,
    user_id: user.id,
    name: profile.name,
    avatar_url: profile.avatar_url,
    address: user.address,
    socket_ids: [],
    token_ids: tokenIds,
    level: 1,
    state: PLAYER_STATE.IDLE
  }
}

module.exports = {
  getPlayers,
  createPlayer
}
