const COLLECTION = Object.freeze({
  PIXEL_HEROES: 1,
  PIXEL_HEROES_X: 2
})

const COLLECTIONS = Object.freeze({
  [COLLECTION.PIXEL_HEROES]: {
    id: COLLECTION.PIXEL_HEROES,
    contract_address: '0xe72323d7900f26d13093cafe76b689964cc99ffc'
  },
  [COLLECTION.PIXEL_HEROES_X]: {
    id: COLLECTION.PIXEL_HEROES_X,
    contract_address: '0xba6e421833f6c190a830ce6e142685b3916c9bd0'
  }
})

const STATIC_RESOURCE_URL = 'https://static.pixelheroes-dao.com'
const METADATA_URL = `${STATIC_RESOURCE_URL}/metadata`
const IMAGE_URL = `${STATIC_RESOURCE_URL}/images`

module.exports = Object.freeze({
  COLLECTION,
  COLLECTIONS,
  STATIC_RESOURCE_URL,
  METADATA_URL,
  IMAGE_URL
})
