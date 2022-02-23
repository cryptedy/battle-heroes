import store from '@/store'
import routes from './routes'
import { createRouter, createWebHistory } from 'vue-router'

const onError = async error => {
  console.log(error)
}

const beforeEach = async (to, from, next) => {
  if (!store.getters['app/initialized']) {
    await store.dispatch('app/initialize')
  }

  next()
}

// eslint-disable-next-line no-unused-vars
const afterEach = (to, from) => {}

const scrollBehavior = (to, from, savedPosition) => {
  if (savedPosition) {
    return savedPosition
  }

  if (to.hash) {
    return {
      el: to.hash,
      behavior: 'smooth'
    }
  }

  return { top: 0 }
}

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  scrollBehavior,
  routes
})

router.onError(onError)
router.beforeEach(beforeEach)
router.afterEach(afterEach)

export default router
