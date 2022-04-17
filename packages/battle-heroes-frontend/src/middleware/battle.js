import store from '@/store'
import { BATTLE_STATE } from '@/utils/constants'

export default async (to, from, next) => {
  if (
    store.getters['game/playerBattle'] &&
    store.getters['game/playerBattle'].state !== BATTLE_STATE.CREATED
  ) {
    next({
      name: 'game',
      params: {
        battleId: store.getters['game/playerBattle'].id
      }
    })
  } else {
    next()
  }
}
