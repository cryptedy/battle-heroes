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
    chain: 'matic',
    total_supply: 1000
  },
  {
    id: COLLECTION_ID.PIXEL_HEROES_X,
    name: 'Pixel Heroes X',
    name_short: 'PHX',
    contract_address: '0xba6e421833f6c190a830ce6e142685b3916c9bd0',
    chain: 'matic',
    total_supply: 5555
  },
  {
    id: COLLECTION_ID.PIXEL_CRYPTO_NINJA_HEROES,
    name: 'Pixel Crypto Ninja Heroes',
    name_short: 'PCNH',
    contract_address: '0xcae19776cb7197676f9b15f1da6d110dddfb181c',
    chain: 'eth',
    total_supply: 5555
  }
]

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
