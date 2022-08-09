import store from '@/store'
import { createApp } from 'vue'
import components from '@/components'
import BaseDialog from '@/components/BaseDialog'
import FontAwesome from '@/plugins/font-awesome'

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
        dialog.use(components)
        dialog.use(FontAwesome)

        const div = document.createElement('div')
        dialog.mount(div)
      }
    }
  }
}
