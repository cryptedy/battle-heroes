import { SET_SCROLLBAR, SET_SCROLLBAR_WIDTH } from '../mutation-types'

function getScrollbarWidth() {
  const outer = document.createElement('div')
  outer.style.visibility = 'hidden'
  outer.style.overflow = 'scroll'

  document.body.appendChild(outer)

  const inner = document.createElement('div')
  outer.appendChild(inner)

  const scrollbarWidth = outer.offsetWidth - inner.offsetWidth

  outer.parentNode.removeChild(outer)

  return scrollbarWidth
}

const initialState = () => ({
  vertical: false,
  horizontal: false,
  width: 0
})

export const state = initialState()

export const getters = {
  hasVertical: state => state.vertical,
  hasHorizontal: state => state.horizontal,
  width: state => state.width
}

export const mutations = {
  [SET_SCROLLBAR](state, { vertical, horizontal }) {
    state.vertical = vertical
    state.horizontal = horizontal
  },

  [SET_SCROLLBAR_WIDTH](state, { width }) {
    state.width = width
  }
}

export const actions = {
  set({ commit }, payload) {
    commit(SET_SCROLLBAR, payload)

    commit(SET_SCROLLBAR_WIDTH, {
      width: payload.vertical ? getScrollbarWidth() : 0
    })
  }
}
