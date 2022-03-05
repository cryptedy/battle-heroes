import BaseGrid from './BaseGrid'
import BaseGridRow from './BaseGridRow'
import BaseSpinner from './BaseSpinner'
import BaseAccordion from './BaseAccordion'
import BaseGridColumn from './BaseGridColumn'

const components = [
  BaseGrid,
  BaseGridRow,
  BaseSpinner,
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
