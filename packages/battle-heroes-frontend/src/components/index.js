import BaseTab from './BaseTab'
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
import BaseTabList from './BaseTabList'
import BaseListItem from './BaseListItem'
import BaseAccordion from './BaseAccordion'
import BaseGridColumn from './BaseGridColumn'
import BaseTabContent from './BaseTabContent'
import BaseTabListItem from './BaseTabListItem'
import BaseTransitionPage from './BaseTransitionPage'

const components = [
  BaseTab,
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
  BaseTabList,
  BaseListItem,
  BaseAccordion,
  BaseGridColumn,
  BaseTabContent,
  BaseTabListItem,
  BaseTransitionPage
]

export default {
  install(app) {
    components.forEach(Component => {
      app.component(Component.name, Component)
    })
  }
}
