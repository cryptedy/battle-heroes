import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import {
  faFire,
  faStar,
  faUser,
  faHouse,
  faUsers,
  faXmark,
  faMessage,
  faLayerGroup,
  faArrowRightFromBracket,
  faArrowLeft
} from '@fortawesome/free-solid-svg-icons'

export default {
  install(app) {
    library.add(
      faFire,
      faStar,
      faUser,
      faHouse,
      faUsers,
      faXmark,
      faMessage,
      faLayerGroup,
      faArrowRightFromBracket,
      faArrowLeft
    )

    app.component(FontAwesomeIcon.name, FontAwesomeIcon)
  }
}
