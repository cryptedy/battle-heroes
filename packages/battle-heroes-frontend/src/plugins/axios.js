import axios from 'axios'
import store from '@/store'
import { NOTIFICATION_TYPE } from '@/utils/constants'

export default {
  // eslint-disable-next-line no-unused-vars
  install(app, options) {
    axios.defaults.timeout = 10000

    axios.interceptors.request.use(
      config => config,
      error => Promise.reject(error)
    )

    axios.interceptors.response.use(
      response => response,
      error => {
        const message = `axios response error: ${error.message}`

        store.dispatch('app/setError', message)

        store.dispatch(
          'notification/add',
          {
            message,
            type: NOTIFICATION_TYPE.ERROR,
            timeout: 0
          },
          { root: true }
        )

        return Promise.reject(error)
      }
    )
  }
}
