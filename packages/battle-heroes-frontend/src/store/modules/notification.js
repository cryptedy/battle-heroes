import { v4 as uuidv4 } from 'uuid'
import { NOTIFICATION_TYPE } from '@/utils/constants'
import { ADD_NOTIFICATION, REMOVE_NOTIFICATION } from '../mutation-types'

const createNotification = notification =>
  Object.assign(
    {
      id: uuidv4(),
      message: '',
      type: NOTIFICATION_TYPE.INFORMATION,
      dismissable: true,
      timeout: 6000
    },
    notification
  )

const initialState = () => ({
  entities: {},
  ids: []
})

export const state = initialState()

export const getters = {
  all: state => state.ids.map(id => state.entities[id])
}

export const mutations = {
  [ADD_NOTIFICATION](state, { notification }) {
    state.entities = { ...state.entities, [notification.id]: notification }
    state.ids.unshift(notification.id)
  },

  [REMOVE_NOTIFICATION](state, { notificationId }) {
    delete state.entities[notificationId]
    state.ids = state.ids.filter(id => id !== notificationId)
  }
}

export const actions = {
  add({ commit, dispatch }, playload) {
    console.log('notification/add', playload)

    const notification = createNotification(playload)

    commit(ADD_NOTIFICATION, { notification })

    if (notification.dismissable) {
      setTimeout(() => {
        dispatch('remove', notification.id)
      }, notification.timeout)
    }
  },

  remove({ commit }, notificationId) {
    console.log('notification/remove', notificationId)

    commit(REMOVE_NOTIFICATION, { notificationId })
  }
}
