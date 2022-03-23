const { getUsers } = require('../user')
const { getUserProfile } = require('../user')
const { getNFTIdsForAddress } = require('../NFT')
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
  const NFTIds = await getNFTIdsForAddress(user.address)

  return {
    id: user.id,
    user_id: user.id,
    name: profile.name,
    avatar_url: profile.avatar_url,
    address: user.address,
    socket_ids: [],
    nft_ids: NFTIds,
    level: 1,
    state: PLAYER_STATE.IDLE
  }
}

module.exports = {
  getPlayers,
  createPlayer
}
