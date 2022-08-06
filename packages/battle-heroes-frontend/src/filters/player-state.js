import { PLAYER_STATE } from '@/utils/constants'

export function playerState(playerState) {
  if (playerState === PLAYER_STATE.IDLE) {
    return 'Idle'
  } else if (playerState === PLAYER_STATE.STANDBY) {
    return 'Standby'
  } else if (playerState === PLAYER_STATE.BATTLE) {
    return 'Battle'
  }

  return 'Unknown'
}
