const COLLECTION_ID = {
  PIXEL_HEROES: 1,
  PIXEL_HEROES_X: 2,
  PIXEL_CRYPTO_NINJA_HEROES: 3
}

const COLLECTIONS = [
  {
    id: COLLECTION_ID.PIXEL_HEROES,
    name: 'Pixel Heroes',
    name_short: 'PHS',
    contract_address: '0xe72323d7900f26d13093cafe76b689964cc99ffc',
    chain: 'matic'
  },
  {
    id: COLLECTION_ID.PIXEL_HEROES_X,
    name: 'Pixel Heroes X',
    name_short: 'PHX',
    contract_address: '0xba6e421833f6c190a830ce6e142685b3916c9bd0',
    chain: 'matic'
  },
  {
    id: COLLECTION_ID.PIXEL_CRYPTO_NINJA_HEROES,
    name: 'Pixel Crypto Ninja Heroes',
    name_short: 'PCNH',
    contract_address: '0xcae19776cb7197676f9b15f1da6d110dddfb181c',
    chain: 'eth'
  }
]

const IS_LOCAL = true

const abiVault = require('./abi/PHBattleVault.json')
const abiExchange = require('./abi/PHGameExchange.json')
const abiToken = require('./abi/PHGameToken.json')

const CONTRACTS = {
  VAULT: {
    address: IS_LOCAL ? '0x5FbDB2315678afecb367f032d93F642f64180aa3' : '0x0',
    abi: abiVault.abi
  },
  EXCHANGE: {
    address: IS_LOCAL ? '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0' : '0x0',
    abi: abiExchange.abi
  },
  ERC20: {
    address: IS_LOCAL ? '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512' : '0x0',
    abi: abiToken.abi
  }
}

const LOCAL_SIGNER = {
  address: '0x70997970C51812dc3A010C7d01b50e0d17dc79C8',
  key: '0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d'
}

const MONSTERS = {
  WOLFMAN: require('./json/monsters/1.json'),
  GHOST: require('./json/monsters/2.json'),
  BEANS: require('./json/monsters/3.json'),
  WORM: require('./json/monsters/4.json'),
  DRAGON: require('./json/monsters/5.json'),
  AKUNIN: require('./json/monsters/6.json')
}

const STATIC_RESOURCE_URL = 'https://static.pixelheroes-dao.com'
const METADATA_URL = `${STATIC_RESOURCE_URL}/metadata`
const IMAGE_URL = `${STATIC_RESOURCE_URL}/images`

const PLAYER_TYPE = {
  HUMAN: 'HUMAN',
  CPU: 'CPU'
}

const PLAYER_STATE = Object.freeze({
  IDLE: 'IDLE',
  STANDBY: 'STANDBY',
  BATTLE: 'BATTLE'
})

const PLAYER_MOVE = Object.freeze({
  ATTACK: 'ATTACK',
  SPELL: 'SPELL',
  HEAL: 'HEAL',
  DEFENCE: 'DEFENCE'
})

const BATTLE_TYPE = {
  HUMAN: 'HUMAN',
  CPU: 'CPU'
}

const BATTLE_STATE = {
  CREATED: 'CREATED',
  READY: 'READY',
  STARTED: 'STARTED',
  RUSHED: 'RUSHED',
  ENDED: 'ENDED'
}

module.exports = Object.freeze({
  COLLECTION_ID,
  COLLECTIONS,
  CONTRACTS,
  IS_LOCAL,
  LOCAL_SIGNER,
  MONSTERS,
  STATIC_RESOURCE_URL,
  METADATA_URL,
  IMAGE_URL,
  PLAYER_TYPE,
  PLAYER_STATE,
  PLAYER_MOVE,
  BATTLE_TYPE,
  BATTLE_STATE
})
