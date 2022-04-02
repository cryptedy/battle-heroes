const { nanoid } = require('@reduxjs/toolkit')
const { selectNFT } = require('../NFT/selectors')
const { selectPlayer } = require('../player/selectors')

class Battle {
  #privateField = 'PRIVATE'

  constructor(playerId, playerNFTId) {
    this.id = nanoid()
    this.turn = 1

    // this.players = {
    //   1: this.createPlayer(playerId, playerNFTId),
    //   2: null
    // }

    this.player = this.createPlayer(playerId, playerNFTId)
    this.opponent_player = this.createPlayer(null, null)
  }

  createPlayer(playerId, playerNFTId) {
    const maxHealth = 100
    const maxMana = 100

    return {
      id: playerId,
      NFT_id: playerNFTId,
      maxHealth: maxHealth,
      health: maxHealth,
      maxMana: maxMana,
      mana: maxMana,
      inventory: [],
      actions: []
    }
  }

  getPlayer() {
    return selectPlayer(this.player.id)
  }

  getOpponentPlayer() {
    return selectPlayer(this.opponent_player.id)
  }

  join(opponentPlayerId, NFTId) {
    this.opponent_player.id = opponentPlayerId
    this.opponent_player.NFT_id = NFTId
  }

  nextTurn() {
    //
  }

  toJSON() {
    return {
      privateField: this.#privateField,
      id: this.id,
      player: this.player,
      opponent_player: this.opponent_player
    }
  }
}

const createBattle = (playerId, NFTId) => new Battle(playerId, NFTId)

module.exports = {
  createBattle
}
