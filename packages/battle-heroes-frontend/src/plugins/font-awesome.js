import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import {
  faFire,
  faStar,
  faUser,
  faHouse,
  faUsers,
  faXmark,
  faDiamond,
  faMessage,
  faArrowLeft,
  faLayerGroup,
  faVolumeHigh,
  faVolumeXmark,
  faChevronLeft,
  faChevronRight,
  faArrowRightFromBracket
} from '@fortawesome/free-solid-svg-icons'

import { faTwitter } from '@fortawesome/free-brands-svg-icons'

export default {
  install(app) {
    library.add(
      faFire,
      faStar,
      faUser,
      faHouse,
      faUsers,
      faXmark,
      faDiamond,
      faMessage,
      faTwitter,
      faArrowLeft,
      faLayerGroup,
      faVolumeHigh,
      faVolumeXmark,
      faChevronLeft,
      faChevronRight,
      faArrowRightFromBracket
    )

    app.component(FontAwesomeIcon.name, FontAwesomeIcon)
  }
}
