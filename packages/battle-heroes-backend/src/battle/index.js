const { nanoid } = require('@reduxjs/toolkit')

const createBattlePlayer = (playerId, playerNFTId) => {
  const maxHealth = 100
  const maxMana = 100

  return {
    id: playerId,
    NFT_id: playerNFTId,
    max_health: maxHealth,
    health: maxHealth,
    max_mana: maxMana,
    mana: maxMana,
    inventory: [],
    actions: []
  }
}

const createBattle = (playerId, NFTId) => {
  return {
    id: nanoid(),
    turn: 1,
    player: createBattlePlayer(playerId, NFTId),
    opponent_player: createBattlePlayer(null, null)
  }
}

module.exports = {
  createBattle
}
