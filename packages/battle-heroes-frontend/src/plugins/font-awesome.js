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

import {
  faDiscord,
  faTwitter,
  faYoutube,
  faMicroblog
} from '@fortawesome/free-brands-svg-icons'

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
      faDiscord,
      faTwitter,
      faYoutube,
      faArrowLeft,
      faFlaskVial,
      faMicroblog,
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
