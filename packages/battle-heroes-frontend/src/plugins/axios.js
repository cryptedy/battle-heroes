import axios from 'axios'
import { HTTP_TIMEOUT } from '@/utils/constants'

export default {
  // eslint-disable-next-line no-unused-vars
  install(app, options) {
    axios.defaults.timeout = HTTP_TIMEOUT

    axios.interceptors.request.use(
      config => config,
      error => Promise.reject(error)
    )

    axios.interceptors.response.use(
      response => response,
      error => {
        const { response } = error

        if (!response) {
          return Promise.reject(error)
        }

        const status = response.status ? Number.parseInt(response.status) : 0

        if (status === 0) {
          return Promise.reject(error)
        }

        const { data } = response

        if (data && data.message) {
          if (
            status === 503 &&
            data.message &&
            data.message === 'The server is under maintenance'
          ) {
            return Promise.reject(data.message)
          }
        }

        return Promise.reject(error)
      }
    )
  }
}
