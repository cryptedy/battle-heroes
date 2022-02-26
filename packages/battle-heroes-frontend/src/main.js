import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import plugins from './plugins'
import components from './components'
import directives from './directives'
import '@/assets/styles/sass/app.scss'

createApp(App)
  .use(store)
  .use(router)
  .use(plugins)
  .use(components)
  .use(directives)
  .mount('#app')
