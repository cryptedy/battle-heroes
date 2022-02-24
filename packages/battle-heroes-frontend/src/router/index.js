import store from '@/store'
import routes from './routes'
import { createRouter, createWebHistory } from 'vue-router'

const globalMiddleware = ['check-auth']

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
  console.log(error)
}

async function beforeEach(to, from, next) {
  const middleware = getMiddleware(to)

  try {
    await callMiddleware(middleware, to, from)
  } catch (error) {
    return next(error)
  }

  if (!store.getters['app/initialized']) {
    try {
      await store.dispatch('NFT/getNFTs')

      if (store.getters['auth/check']) {
        await store.dispatch('auth/getUserNFTTokenIds')
      }
    } catch (error) {
      //
    }
  }

  next()
}

// eslint-disable-next-line no-unused-vars
async function afterEach(to, from) {
  await store.dispatch('app/initialized')
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

  // to.matched.forEach(match => {
  //   if (match.meta.middleware) {
  //     if (Array.isArray(match.meta.middleware)) {
  //       middleware.push(...match.meta.middleware)
  //     } else {
  //       middleware.push(match.meta.middleware)
  //     }
  //   }
  // })

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
