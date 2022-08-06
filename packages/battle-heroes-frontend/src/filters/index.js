import { datetime } from './datetime'
import { playerState } from './player-state'
import { NFTShortName } from './NFT-short-name'

export default {
  install(app) {
    app.config.globalProperties.$filters = {
      datetime,
      playerState,
      NFTShortName
    }
  }
}
