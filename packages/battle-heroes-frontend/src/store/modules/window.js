import * as types from '../mutation-types'

const initialState = () => ({
  dimensions: {
    width: window.innerWidth,
    height: window.innerHeight,
    offsetX: window.pageXOffset,
    offsetY: window.pageYOffset
  }
})

export const state = initialState()

export const getters = {
  dimensions: state => state.dimensions,
  width: state => state.dimensions.width,
  height: state => state.dimensions.height,
  offsetX: state => state.dimensions.offsetX,
  offsetY: state => state.dimensions.offsetY
}

export const mutations = {
  [types.RESET_WINDOW_STATE](state) {
    Object.assign(state, initialState())
  },

  [types.UPDATE_WINDOW_SIZE](state, { width, height }) {
    state.dimensions.width = width
    state.dimensions.height = height
  },

  [types.UPDATE_WINDOW_OFFSET](state, { offsetX, offsetY }) {
    state.dimensions.offsetX = offsetX
    state.dimensions.offsetY = offsetY
  }
}

export const actions = {
  reset({ commit }) {
    commit(types.RESET_WINDOW_STATE)
  },

  updateSize({ commit }, payload) {
    commit(types.UPDATE_WINDOW_SIZE, {
      width: payload.width,
      height: payload.height
    })
  },

  updateOffset({ commit }, payload) {
    commit(types.UPDATE_WINDOW_OFFSET, {
      offsetX: payload.offsetX,
      offsetY: payload.offsetY
    })
  }
}
