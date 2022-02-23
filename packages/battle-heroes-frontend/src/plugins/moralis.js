import Moralis from 'moralis/dist/moralis.min.js'

export default {
  // eslint-disable-next-line no-unused-vars
  install(app, options) {
    Moralis.start({
      serverUrl: process.env.VUE_APP_MORALIS_SERVER_URL,
      appId: process.env.VUE_APP_MORALIS_APPLICATION_ID
    })
  }
}
