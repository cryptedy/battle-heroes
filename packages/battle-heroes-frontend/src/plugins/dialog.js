import store from '@/store'
import { createApp } from 'vue'
import BaseDialog from '@/components/BaseDialog'
import BaseOverlay from '@/components/BaseOverlay'

export default {
  install(app) {
    app.config.globalProperties.$dialog = {
      open: (props = {}) => {
        const defaultProps = {
          open: true,
          programmatic: true
        }

        const propsData = Object.assign(defaultProps, props)

        const dialog = createApp(BaseDialog, propsData)

        dialog.use(this)
        dialog.use(store)
        dialog.component(BaseOverlay.name, BaseOverlay)

        const div = document.createElement('div')
        dialog.mount(div)
      }
    }
  }
}
