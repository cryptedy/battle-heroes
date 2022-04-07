import constants from '../../../battle-heroes-utils/constants'

export const COLLECTION_ID = constants.COLLECTION_ID
export const COLLECTIONS = constants.COLLECTIONS
export const PLAYER_STATE = constants.PLAYER_STATE
export const PLAYER_MOVE = constants.PLAYER_MOVE
export const BATTLE_STATE = constants.BATTLE_STATE

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
  DATETIME_FORMAT,
  NOTIFICATION_TYPE
})
