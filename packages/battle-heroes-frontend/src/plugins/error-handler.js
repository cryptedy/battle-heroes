export default {
  // eslint-disable-next-line no-unused-vars
  install(app, options) {
    app.config.errorHandler = (error, vm, info) => {
      console.log({
        type: 'vue',
        message: `${error.message} => ${info}`,
        stack: error.stack
      })
    }

    window.addEventListener('error', event => {
      if (event.error) {
        console.log({
          type: 'error',
          message: event.error.message,
          stack: event.error.stack
        })
      }

      event.preventDefault()
    })

    window.addEventListener('unhandledrejection', event => {
      console.log({
        type: 'unhandledrejection',
        message: `${event.reason.message} => ${event.reason.config.method}@${event.reason.config.url}`,
        stack: event.reason.stack
      })

      event.preventDefault()
    })

    window.onerror = (message, file, line, column, error) => {
      const stack = error
        ? error.stack
        : `${file} => line ${line} column ${column}`
      console.log({
        type: 'onerror',
        message: message,
        stack: stack
      })
    }
  }
}
