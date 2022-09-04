import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import {
  faPlus,
  faStar,
  faUser,
  faGhost,
  faStore,
  faUsers,
  faXmark,
  faKhanda,
  faDiamond,
  faMessage,
  faArrowLeft,
  faFlaskVial,
  faLayerGroup,
  faVolumeHigh,
  faRankingStar,
  faVolumeXmark,
  faChevronLeft,
  faChevronRight,
  faBookJournalWhills,
  faArrowRightFromBracket
} from '@fortawesome/free-solid-svg-icons'

import { faTwitter } from '@fortawesome/free-brands-svg-icons'

export default {
  install(app) {
    library.add(
      faPlus,
      faStar,
      faUser,
      faGhost,
      faStore,
      faUsers,
      faXmark,
      faKhanda,
      faDiamond,
      faMessage,
      faTwitter,
      faArrowLeft,
      faFlaskVial,
      faLayerGroup,
      faVolumeHigh,
      faRankingStar,
      faVolumeXmark,
      faChevronLeft,
      faChevronRight,
      faBookJournalWhills,
      faArrowRightFromBracket
    )

    app.component(FontAwesomeIcon.name, FontAwesomeIcon)
  }
}
