import moralis from './moralis'

export default {
  // eslint-disable-next-line no-unused-vars
  install(app, options) {
    app.use(moralis)
  }
}
