import { SET_SCROLLBAR, SET_SCROLLBAR_WIDTH } from '../mutation-types'

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
    const { vertical, horizontal, width } = payload

    commit(SET_SCROLLBAR, { vertical, horizontal })
    commit(SET_SCROLLBAR_WIDTH, { width })
  }
}
