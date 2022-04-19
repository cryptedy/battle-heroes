import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import {
  faFire,
  faPlay,
  faStar,
  faUser,
  faHouse,
  faPause,
  faUsers,
  faXmark,
  faMessage,
  faArrowLeft,
  faLayerGroup,
  faArrowRightFromBracket
} from '@fortawesome/free-solid-svg-icons'

export default {
  install(app) {
    library.add(
      faFire,
      faPlay,
      faStar,
      faUser,
      faHouse,
      faPause,
      faUsers,
      faXmark,
      faMessage,
      faArrowLeft,
      faLayerGroup,
      faArrowRightFromBracket
    )

    app.component(FontAwesomeIcon.name, FontAwesomeIcon)
  }
}
