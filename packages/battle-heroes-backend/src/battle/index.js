const { v4: uuidv4 } = require('uuid')
const { BATTLE_STATE } = require('../utils/constants')

const getRandomArbitrary = (min, max) => {
  return Math.floor(Math.random() * (max - min) + min)
}

const createBattlePlayer = (playerId, NFTId) => {
  const maxHp = getRandomArbitrary(80, 100)
  const attack = getRandomArbitrary(40, 50)
  const defense = getRandomArbitrary(40, 50)
  const speed = getRandomArbitrary(40, 50)

  return {
    id: playerId,
    NFT: {
      id: NFTId,
      max_hp: maxHp,
      hp: maxHp,
      attack: attack,
      defense: defense,
      speed: speed
    }
  }
}

const createStatus = () => {
  const maxHp = getRandomArbitrary(80, 100)
  const attack = getRandomArbitrary(40, 50)
  const defense = getRandomArbitrary(40, 50)
  const speed = getRandomArbitrary(40, 50)

  return {
    max_hp: maxHp,
    hp: maxHp,
    attack: attack,
    defense: defense,
    speed: speed
  }
}

const createBattle = (playerId, NFTId) => {
  return {
    id: uuidv4(),
    turn: 1,
    current_move: 1,
    player1: createBattlePlayer(playerId, NFTId),
    player2: null,
    players: {
      1: {
        id: playerId
      },
      2: {
        id: null
      }
    },
    NFTs: {
      1: {
        id: NFTId
      },
      2: {
        id: null
      }
    },
    status: {
      1: {
        ...createStatus()
      },
      2: {
        ...createStatus()
      }
    },
    messages: [],
    state: BATTLE_STATE.CREATED
  }
}

module.exports = {
  createBattle,
  createBattlePlayer
}
