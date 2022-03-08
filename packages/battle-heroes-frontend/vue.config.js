const path = require('path')
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

    const types = ['vue-modules', 'vue', 'normal-modules', 'normal']
    types.forEach(type =>
      addStyleResource(config.module.rule('scss').oneOf(type))
    )
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

function addStyleResource(rule) {
  rule
    .use('style-resource')
    .loader('style-resources-loader')
    .options({
      patterns: [
        path.resolve(__dirname, './src/assets/styles/sass/utils/*.scss')
      ]
    })
}
