import { PLAYER_STATE } from '@/utils/constants'

export function playerState(value) {
  if (value === PLAYER_STATE.IDLE) {
    return 'Idle'
  } else if (value === PLAYER_STATE.STANDBY) {
    return 'Standby'
  } else if (value === PLAYER_STATE.BATTLE) {
    return 'Battle'
  }

  return 'Unknown'
}
