import i18nPlugin from './i18n'
import { socket } from './socket'
import socketPlugin from './socket'
import moralisPlugin from './moralis'
import errorHandlerPlugin from './error-handler'
import networkHandlerPlugin from './network-handler'

export default {
  // eslint-disable-next-line no-unused-vars
  install(app, options) {
    app.use(i18nPlugin)
    app.use(socketPlugin)
    app.use(moralisPlugin)
    app.use(errorHandlerPlugin)
    app.use(networkHandlerPlugin)
  }
}

export { socket }
