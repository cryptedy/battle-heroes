import { nextTick } from 'vue'

export default {
  install(app) {
    app.directive('focus', {
      mounted(el) {
        nextTick(() => el.focus())
      }
    })
  }
}
