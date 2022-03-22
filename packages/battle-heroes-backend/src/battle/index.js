const { nanoid } = require('@reduxjs/toolkit')

const createBattle = (player, NFT) => {
  return {
    id: nanoid(),
    player: {
      id: player.id,
      NFT
    },
    opponent_player: {
      id: null,
      NFT: null
    }
  }
}

module.exports = {
  createBattle
}
