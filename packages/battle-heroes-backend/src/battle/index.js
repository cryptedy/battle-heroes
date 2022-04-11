const { v4: uuidv4 } = require('uuid')
const { BATTLE_STATE } = require('../utils/constants')

const createBattle = (playerId, NFTId) => {
  return {
    id: uuidv4(),
    players: {
      1: {
        id: playerId,
        NFT_id: NFTId
      },
      2: {
        id: null,
        NFT_id: null
      }
    },
    state: BATTLE_STATE.CREATED
  }
}

module.exports = {
  createBattle
}
