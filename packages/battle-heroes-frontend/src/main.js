import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import plugins from './plugins'
import directives from './directives'
import '@/assets/styles/sass/app.scss'

createApp(App).use(store).use(router).use(plugins).use(directives).mount('#app')
