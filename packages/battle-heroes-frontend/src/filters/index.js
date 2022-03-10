import { playerState } from './player-state'

export default {
  install(app) {
    app.config.globalProperties.$filters = {
      playerState
    }
  }
}
