import constants from '../../../battle-heroes-utils/constants'

export const COLLECTION_ID = constants.COLLECTION_ID
export const COLLECTIONS = constants.COLLECTIONS
export const PLAYER_STATE = constants.PLAYER_STATE
export const PLAYER_MOVE = constants.PLAYER_MOVE
export const BATTLE_STATE = constants.BATTLE_STATE

export const BACKEND_URL = process.env.VUE_APP_BACKEND_URL
export const API_URL = `${BACKEND_URL}/api`
export const HTTP_TIMEOUT = 20000
export const SOCKET_TIMEOUT = 20000
export const LOGIN_TIMEOUT = 60000
export const NOTIFICATION_TIMEOUT = 3000
export const NOTIFICATION_TYPE = Object.freeze({
  INFORMATION: 'INFORMATION',
  WARNING: 'WARNING',
  SUCCESS: 'SUCCESS',
  ERROR: 'ERROR'
})
export const DATETIME_FORMAT = 'MM-DD HH:mm:ss'

export const MUSIC = Object.freeze({
  STANDBY: 'STANDBY',
  BATTLE: 'BATTLE'
})

export const SOUND_EFFECT = Object.freeze({
  ATTACK: 'ATTACK',
  ATTACK_CRITICAL: 'ATTACK_CRITICAL',
  HEAL: 'HEAL',
  DAMAGE: 'DAMAGE',
  ENCOUNTER: 'ENCOUNTER'
})

export default Object.freeze({
  ...constants,
  BACKEND_URL,
  API_URL,
  HTTP_TIMEOUT,
  SOCKET_TIMEOUT,
  DATETIME_FORMAT,
  NOTIFICATION_TYPE
})
