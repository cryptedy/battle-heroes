import store from '@/store'
import { NOTIFICATION_TYPE } from '@/utils/constants'

export default {
  // eslint-disable-next-line no-unused-vars
  install(app, options) {
    app.config.errorHandler = (error, vm, info) => {
      store.dispatch('notification/add', {
        message: `${error.message} ${info}`,
        type: NOTIFICATION_TYPE.ERROR,
        timeout: 0
      })

      console.log({
        type: 'vue',
        message: `${error.message}: ${info}`,
        stack: error.stack
      })
    }

    window.addEventListener('error', event => {
      if (event.error) {
        store.dispatch('notification/add', {
          message: `${event.error.message}: ${event.error.stack}`,
          type: NOTIFICATION_TYPE.ERROR,
          timeout: 0
        })

        console.log({
          type: 'error',
          message: event.error.message,
          stack: event.error.stack
        })
      }

      event.preventDefault()
    })

    window.addEventListener('unhandledrejection', event => {
      store.dispatch('notification/add', {
        message: `${event.reason.message}: ${event.reason.config.method}: ${event.reason.config.url}`,
        type: NOTIFICATION_TYPE.ERROR,
        timeout: 0
      })

      console.log({
        type: 'unhandledrejection',
        message: `${event.reason.message}: ${event.reason.config.method}: ${event.reason.config.url}`,
        stack: event.reason.stack
      })

      event.preventDefault()
    })

    window.onerror = (message, file, line, column, error) => {
      const stack = error
        ? error.stack
        : `${file} line ${line} column ${column}`

      store.dispatch('notification/add', {
        message: `${message}: ${stack}`,
        type: NOTIFICATION_TYPE.ERROR,
        timeout: 0
      })

      console.log({
        type: 'onerror',
        message: message,
        stack: stack
      })
    }
  }
}
