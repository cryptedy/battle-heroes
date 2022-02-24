const view = path => () =>
  import(/* webpackChunkName: "" */ `@/views/${path}`).then(
    module => module.default || module
  )

export default [
  {
    path: '/',
    name: 'home',
    meta: { middleware: ['guest'] },
    component: view('Home')
  },
  {
    path: '/lobby',
    name: 'lobby',
    meta: { middleware: ['auth'] },
    component: view('Lobby')
  },
  {
    path: '/login',
    name: 'login',
    meta: { middleware: ['guest'] },
    component: view('Login')
  },
  {
    path: '/logout',
    name: 'logout',
    meta: { middleware: ['auth'] },
    component: view('Logout')
  }
]
