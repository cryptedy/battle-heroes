import axios from 'axios'

export default {
  // eslint-disable-next-line no-unused-vars
  install(app, options) {
    axios.defaults.timeout = 15000

    axios.interceptors.request.use(
      config => config,
      error => Promise.reject(error)
    )

    axios.interceptors.response.use(
      response => response,
      error => Promise.reject(error)
    )
  }
}
