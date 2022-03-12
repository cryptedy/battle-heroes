import constants from '../../../battle-heroes-utils/constants'

export const COLLECTION = constants.COLLECTION
export const COLLECTIONS = constants.COLLECTIONS
export const PLAYER_STATE = constants.PLAYER_STATE

export const BACKEND_URL = process.env.VUE_APP_BACKEND_URL
export const API_URL = `${BACKEND_URL}/api`

export default Object.freeze({
  ...constants,
  BACKEND_URL,
  API_URL
})
