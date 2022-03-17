import { createStore } from 'vuex'
import { socket } from '@/plugins'
import createWebSocketPlugin from './plugins/socket'

const requireContext = require.context('./modules', false, /.*\.js$/)
const modules = requireContext
  .keys()
  .map(file => [file.replace(/(^.\/)|(\.js$)/g, ''), requireContext(file)])
  .reduce((modules, [name, module]) => {
    if (module.namespaced === undefined) {
      module.namespaced = true
    }

    return { ...modules, [name]: module }
  }, {})

const webSocketPlugin = createWebSocketPlugin(socket)

export default createStore({
  modules,
  plugins: [webSocketPlugin],
  strict: process.env.NODE_ENV !== 'production'
})
