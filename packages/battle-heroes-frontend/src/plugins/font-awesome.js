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
  faArrowLeft,
  faLayerGroup,
  faVolumeHigh,
  faVolumeXmark,
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
      faMessage,
      faTwitter,
      faArrowLeft,
      faLayerGroup,
      faVolumeHigh,
      faVolumeXmark,
      faArrowRightFromBracket
    )

    app.component(FontAwesomeIcon.name, FontAwesomeIcon)
  }
}
