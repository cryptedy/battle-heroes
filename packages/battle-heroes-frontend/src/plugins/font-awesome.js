import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import {
  faSun,
  faFire,
  faStar,
  faUser,
  faHouse,
  faUsers,
  faMessage,
  faLayerGroup,
  faCloudShowersHeavy
} from '@fortawesome/free-solid-svg-icons'

export default {
  install(app) {
    library.add(
      faSun,
      faFire,
      faStar,
      faUser,
      faHouse,
      faUsers,
      faMessage,
      faLayerGroup,
      faCloudShowersHeavy
    )

    app.component(FontAwesomeIcon.name, FontAwesomeIcon)
  }
}
