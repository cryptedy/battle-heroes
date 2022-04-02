import constants from '../../../battle-heroes-utils/constants'

export const COLLECTION_ID = constants.COLLECTION_ID
export const COLLECTIONS = constants.COLLECTIONS
export const PLAYER_STATE = constants.PLAYER_STATE

export const BACKEND_URL = process.env.VUE_APP_BACKEND_URL
export const API_URL = `${BACKEND_URL}/api`
export const DATETIME_FORMAT = 'MM-DD HH:mm:ss'
export const NOTIFICATION_TYPE = Object.freeze({
  INFORMATION: 'INFORMATION',
  WARNING: 'WARNING',
  SUCCESS: 'SUCCESS',
  ERROR: 'ERROR'
})

export default Object.freeze({
  ...constants,
  BACKEND_URL,
  API_URL,
  NOTIFICATION_TYPE
})
