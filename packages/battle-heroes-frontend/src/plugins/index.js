import i18n from './i18n'
import socket from './socket'
import moralis from './moralis'

export default {
  // eslint-disable-next-line no-unused-vars
  install(app, options) {
    app.use(i18n)
    app.use(socket)
    app.use(moralis)
  }
}
