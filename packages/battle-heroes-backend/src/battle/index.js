const { nanoid } = require('@reduxjs/toolkit')
const { selectNFT } = require('../NFT/selectors')
const { selectPlayer } = require('../player/selectors')

class Battle {
  #privateField = 'PRIVATE'

  constructor(io, playerId, playerNFTId) {
    console.log(io)
    this.id = nanoid()
    this.turn = 1

    // this.players = {
    //   1: this.createPlayer(playerId, playerNFTId),
    //   2: null
    // }

    this.player = this.createPlayer(playerId, playerNFTId)
    this.opponent_player = this.createPlayer(null, null)
    this.io = io
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

    this.getPlayer().socket_ids.forEach(socketId => {
      console.log(socketId)
      this.io.to(socketId).emit('battle:matched', this)
    })

    this.getOpponentPlayer().socket_ids.forEach(socketId => {
      console.log(socketId)
      this.io.to(socketId).emit('battle:matched', this)
    })
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

const createBattle = (io, player, NFTId) => new Battle(io, player.id, NFTId)

module.exports = {
  createBattle
}
