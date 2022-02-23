import { createI18n } from 'vue-i18n'

const messages = {
  en: {
    message: {
      login: 'login'
    }
  },
  ja: {
    message: {
      login: 'ログイン'
    }
  }
}

const i18n = createI18n({
  locale: 'en',
  fallbackLocale: 'en',
  messages: messages
})

export default {
  // eslint-disable-next-line no-unused-vars
  install(app, options) {
    app.use(i18n)
  }
}
