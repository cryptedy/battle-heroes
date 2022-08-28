import BaseTab from './BaseTab'
import BaseNFT from './BaseNFT'
import BaseCard from './BaseCard'
import BaseList from './BaseList'
import BaseMenu from './BaseMenu'
import BaseEmpty from './BaseEmpty'
import BaseButton from './BaseButton'
import BaseDialog from './BaseDialog'
import BaseDrawer from './BaseDrawer'
import BaseOverlay from './BaseOverlay'
import BaseSpinner from './BaseSpinner'
import BaseTabList from './BaseTabList'
import BaseListItem from './BaseListItem'
import BaseAccordion from './BaseAccordion'
import BaseTabContent from './BaseTabContent'
import BaseTabListItem from './BaseTabListItem'

const components = [
  BaseTab,
  BaseNFT,
  BaseCard,
  BaseList,
  BaseMenu,
  BaseEmpty,
  BaseButton,
  BaseDialog,
  BaseDrawer,
  BaseOverlay,
  BaseSpinner,
  BaseTabList,
  BaseListItem,
  BaseAccordion,
  BaseTabContent,
  BaseTabListItem
]

export default {
  install(app) {
    components.forEach(Component => {
      app.component(Component.name, Component)
    })
  }
}
