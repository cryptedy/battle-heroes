import store from '@/store'
import routes from './routes'
import { NOTIFICATION_TYPE } from '@/utils/constants'
import { createRouter, createWebHistory } from 'vue-router'

const globalMiddleware = ['auth-check']

const routeMiddleware = resolveMiddleware(
  require.context('@/middleware', false, /.*\.js$/)
)

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  scrollBehavior,
  routes
})

router.onError(onError)
router.beforeEach(beforeEach)
router.afterEach(afterEach)

export default router

async function onError(error) {
  const message = `router error: ${error.message}`

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
}

async function beforeEach(to, from, next) {
  document.body.classList.remove('has-dialog', 'has-drawer')

  if (!store.getters['app/isLoaded']) {
    await store.dispatch('app/setLoading', true)
  }

  if (!store.getters['NFT/count'] > 0) {
    await store.dispatch('NFT/fetch')
  }

  const middleware = getMiddleware(to)

  try {
    await callMiddleware(middleware, to, from)
  } catch (error) {
    return next(error)
  }

  next()
}

// eslint-disable-next-line no-unused-vars
async function afterEach(to, from) {
  if (store.getters['app/isLoading']) {
    store.dispatch('app/setLoading', false)
  }

  if (!store.getters['app/isLoaded']) {
    store.dispatch('app/setLoaded', true)
  }
}

function scrollBehavior(to, from, savedPosition) {
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

async function callMiddleware(middleware, to, from) {
  const stack = middleware.reverse()

  return new Promise((resolve, reject) => {
    const _next = (...args) => {
      if (args.length > 0 || stack.length === 0) {
        if (args.length > 0) {
          return reject(...args)
        }

        return resolve()
      }

      const { middleware, params } = parseMiddleware(stack.pop())
      if (typeof middleware === 'function') {
        middleware(to, from, _next, params)
      } else if (routeMiddleware[middleware]) {
        routeMiddleware[middleware](to, from, _next, params)
      } else {
        throw Error(`Undefined middleware [${middleware}]`)
      }
    }

    _next()
  })
}

function parseMiddleware(middleware) {
  if (typeof middleware === 'function') {
    return { middleware }
  }

  const [name, options] = middleware.split(':')

  let params
  if (options) {
    params = options ? options.split(',') : undefined
    if (Array.isArray(params) && params.length === 1) {
      params = params[0]
    }
  }

  return { middleware: name, params }
}

function getMiddleware(to) {
  const middleware = [...globalMiddleware]

  if (to.meta.middleware) {
    if (Array.isArray(to.meta.middleware)) {
      middleware.push(...to.meta.middleware)
    } else {
      middleware.push(to.meta.middleware)
    }
  }

  return middleware
}

function resolveMiddleware(requireContext) {
  return requireContext
    .keys()
    .map(file => [file.replace(/(^.\/)|(\.js$)/g, ''), requireContext(file)])
    .reduce(
      (guards, [name, guard]) => ({ ...guards, [name]: guard.default }),
      {}
    )
}
