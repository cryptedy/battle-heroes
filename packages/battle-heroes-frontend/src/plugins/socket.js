import socket from '@/utils/socket'

export default {
  // eslint-disable-next-line no-unused-vars
  install(app, options) {
    app.config.globalProperties.$socket = socket
  }
}
