import BaseNFT from './BaseNFT'
import BaseGrid from './BaseGrid'
import BaseMenu from './BaseMenu'
import BaseDialog from './BaseDialog'
import BaseDrawer from './BaseDrawer'
import BaseGridRow from './BaseGridRow'
import BaseOverlay from './BaseOverlay'
import BaseSpinner from './BaseSpinner'
import BaseAccordion from './BaseAccordion'
import BaseGridColumn from './BaseGridColumn'
import BasePlayerAvatar from './BasePlayerAvatar'

const components = [
  BaseNFT,
  BaseGrid,
  BaseMenu,
  BaseDialog,
  BaseDrawer,
  BaseGridRow,
  BaseOverlay,
  BaseSpinner,
  BaseAccordion,
  BaseGridColumn,
  BasePlayerAvatar
]

export default {
  install(app) {
    components.forEach(Component => {
      app.component(Component.name, Component)
    })
  }
}
