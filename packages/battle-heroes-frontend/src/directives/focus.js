import { nextTick } from 'vue'

export default {
  install(app) {
    app.directive('focus', {
      // eslint-disable-next-line no-unused-vars
      mounted(el, binding, vnode, prevVnode) {
        nextTick(() => el.focus())
      }
    })
  }
}
