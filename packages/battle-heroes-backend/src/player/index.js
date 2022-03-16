const { getUserProfile } = require('../user')
const { getTokenIdsForAddress } = require('../NFT')
const { PLAYER_STATE } = require('../utils/constants')

const createPlayer = async (user, socket) => {
  const profile = await getUserProfile(user)
  const tokenIds = await getTokenIdsForAddress(user.address)

  return {
    id: user.id,
    user_id: user.id,
    name: profile.name,
    avatar_url: profile.avatar_url,
    address: user.address,
    socket_ids: [socket.id],
    token_ids: tokenIds,
    level: 1,
    state: PLAYER_STATE.IDLE
  }
}

module.exports = {
  createPlayer
}
