import { createApp } from 'vue'
import App from './App.vue'
import store from './store'
import router from './router'
import filters from './filters'
import plugins from './plugins'
import components from './components'
import directives from './directives'
import './assets/styles/sass/app.scss'

const app = createApp(App)

app.config.errorHandler = (error, instance, info) => {
  console.log('errorHandler')
  console.log(error, instance, info)
}

app
  .use(store)
  .use(router)
  .use(filters)
  .use(plugins)
  .use(components)
  .use(directives)
  .mount('#app')
