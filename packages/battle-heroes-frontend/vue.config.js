const { defineConfig } = require('@vue/cli-service')

const url = new URL(process.env.VUE_APP_URL || 'http://localhost:8080')

module.exports = defineConfig({
  productionSourceMap: false,

  transpileDependencies: true,

  chainWebpack: config => {
    config.plugin('html').tap(args => {
      args[0].title = process.env.VUE_APP_TITLE
      return args
    })
  },

  css: {
    sourceMap: true
  },

  devServer: {
    https: url.protocol === 'https' ? true : false,
    host: url.hostname,
    port: url.port,
    compress: true
  }
})
