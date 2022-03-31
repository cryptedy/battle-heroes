import BaseNFT from './BaseNFT'
import BaseCard from './BaseCard'
import BaseGrid from './BaseGrid'
import BaseList from './BaseList'
import BaseMenu from './BaseMenu'
import BaseEmpty from './BaseEmpty'
import BaseButton from './BaseButton'
import BaseDialog from './BaseDialog'
import BaseDrawer from './BaseDrawer'
import BaseGridRow from './BaseGridRow'
import BaseOverlay from './BaseOverlay'
import BaseSpinner from './BaseSpinner'
import BaseListItem from './BaseListItem'
import BaseAccordion from './BaseAccordion'
import BaseGridColumn from './BaseGridColumn'

const components = [
  BaseNFT,
  BaseCard,
  BaseGrid,
  BaseList,
  BaseMenu,
  BaseEmpty,
  BaseButton,
  BaseDialog,
  BaseDrawer,
  BaseGridRow,
  BaseOverlay,
  BaseSpinner,
  BaseListItem,
  BaseAccordion,
  BaseGridColumn
]

export default {
  install(app) {
    components.forEach(Component => {
      app.component(Component.name, Component)
    })
  }
}
