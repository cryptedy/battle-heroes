import constants from '../../../battle-heroes-utils/constants'

export const COLLECTION = constants.COLLECTION
export const COLLECTIONS = constants.COLLECTIONS
export const STATIC_RESOURCE_URL = constants.STATIC_RESOURCE_URL
export const METADATA_URL = constants.METADATA_URL
export const IMAGE_URL = constants.IMAGE_URL

export const BACKEND_URL = process.env.VUE_APP_BACKEND_URL
export const API_URL = `${BACKEND_URL}/api`

export default Object.freeze({
  ...constants,
  BACKEND_URL,
  API_URL
})