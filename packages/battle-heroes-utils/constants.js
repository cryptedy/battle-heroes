const COLLECTION_ID = {
  PIXEL_HEROES: 1,
  PIXEL_HEROES_X: 2,
  PIXEL_CRYPTO_NINJA_HEROES: 3
}

const COLLECTIONS = [
  {
    id: COLLECTION_ID.PIXEL_HEROES,
    name: 'Pixel Heroes',
    contract_address: '0xe72323d7900f26d13093cafe76b689964cc99ffc',
    chain: 'matic'
  },
  {
    id: COLLECTION_ID.PIXEL_HEROES_X,
    name: 'Pixel Heroes X',
    contract_address: '0xba6e421833f6c190a830ce6e142685b3916c9bd0',
    chain: 'matic'
  },
  {
    id: COLLECTION_ID.PIXEL_CRYPTO_NINJA_HEROES,
    name: 'Pixel Crypto Ninja Heroes',
    contract_address: '0xcae19776cb7197676f9b15f1da6d110dddfb181c',
    chain: 'eth'
  }
]

const STATIC_RESOURCE_URL = 'https://static.pixelheroes-dao.com'
const METADATA_URL = `${STATIC_RESOURCE_URL}/metadata`
const IMAGE_URL = `${STATIC_RESOURCE_URL}/images`

const PLAYER_STATE = Object.freeze({
  IDLE: 'IDLE',
  STANDBY: 'STANDBY',
  BATTLE: 'BATTLE'
})

const PLAYER_MOVE = Object.freeze({
  ATTACK: 'ATTACK',
  HEAL: 'HEAL',
  DEFENCE: 'DEFENCE',
  RUN: 'RUN'
})

const BATTLE_STATE = {
  CREATED: 'CREATED',
  READY: 'READY',
  STARTED: 'STARTED',
  ENDED: 'ENDED'
}

module.exports = Object.freeze({
  COLLECTION_ID,
  COLLECTIONS,
  STATIC_RESOURCE_URL,
  METADATA_URL,
  IMAGE_URL,
  PLAYER_STATE,
  PLAYER_MOVE,
  BATTLE_STATE
})
