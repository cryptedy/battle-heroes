const { updatePlayer } = require('./actions')
const { selectPlayer } = require('./selectors')
const { getNFTIdsForAddress } = require('../NFT')
const { PLAYER_STATE } = require('../utils/constants')
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
          name: profile.name,
          avatar_url: profile.avatar_url,
          address: user.address,
          socket_ids: [],
          nft_ids: NFTIds,
          exp: user.exp,
          win: user.win,
          lose: user.lose,
          state: PLAYER_STATE.IDLE
        })
      } catch (error) {
        reject(error)
      }
    }, 5000)
  })
}

const updatePlayerStats = async (playerId, payload) => {
  console.log('updatePlayerStats', playerId, payload)

  const player = selectPlayer(playerId)

  const user = await updateUser(player.user_id, payload)

  updatePlayer({
    playerId,
    payload: {
      exp: user.exp,
      win: user.win,
      lose: user.lose
    }
  })
}

module.exports = {
  getPlayers,
  createPlayer,
  updatePlayerStats
}
