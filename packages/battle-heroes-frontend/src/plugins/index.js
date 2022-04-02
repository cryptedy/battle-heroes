import { socket } from './socket'
import dialogPlugin from './dialog'
import socketPlugin from './socket'
import moralisPlugin from './moralis'
import fontAwesomePlugin from './font-awesome'
import errorHandlerPlugin from './error-handler'
import networkHandlerPlugin from './network-handler'

export default {
  // eslint-disable-next-line no-unused-vars
  install(app, options) {
    app.use(dialogPlugin)
    app.use(socketPlugin)
    app.use(moralisPlugin)
    app.use(fontAwesomePlugin)
    app.use(errorHandlerPlugin)
    app.use(networkHandlerPlugin)
  }
}

export { socket }
