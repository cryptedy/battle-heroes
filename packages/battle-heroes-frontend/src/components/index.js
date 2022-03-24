import BaseNFT from './BaseNFT'
import BaseList from './BaseList'
import BaseMenu from './BaseMenu'
import BaseEmpty from './BaseEmpty'
import BaseButton from './BaseButton'
import BaseDialog from './BaseDialog'
import BaseDrawer from './BaseDrawer'
import BaseOverlay from './BaseOverlay'
import BaseSpinner from './BaseSpinner'
import BaseListItem from './BaseListItem'
import BaseAccordion from './BaseAccordion'

const components = [
  BaseNFT,
  BaseList,
  BaseMenu,
  BaseEmpty,
  BaseButton,
  BaseDialog,
  BaseDrawer,
  BaseOverlay,
  BaseSpinner,
  BaseListItem,
  BaseAccordion
]

export default {
  install(app) {
    components.forEach(Component => {
      app.component(Component.name, Component)
    })
  }
}
